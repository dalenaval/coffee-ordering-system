from fastapi import APIRouter, Depends, HTTPException,status
from sqlalchemy.orm import Session, selectinload

from app.db.deps import get_db
from app.models.cart import Cart
from app.models.product import Product
from app.models.cart_item import CartItem
from app.models.cart_item_option import CartItemOption
from app.services.auth import get_current_user
from app.services.cart import format_cart, flatten_list, get_or_create_cart


router = APIRouter(prefix='/cart', tags=['Cart'] )

def calculate_line_total(base: float, option_total: float, quantity :int):
    return (float(base) + option_total) * quantity

@router.post('/add-to-cart')
def add_products_to_cart( payload: dict,user_id = Depends(get_current_user), db:Session = Depends(get_db) ):

    try:
        cart = get_or_create_cart(db, user_id)
        existingItem = db.query(CartItem).filter(CartItem.product_code == payload.get("product_code"), CartItem.cart_id == cart.id).first()
        quantity = payload.get("quantity", 0) + (existingItem.quantity if existingItem else 0)
        has_stock = db.query(Product).filter(Product.id == payload.get("product_id"), Product.stock >= quantity).first()
       
        if not has_stock:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Insufficient stock for the requested quantity")
        
        if existingItem:
            
            updatedQuantity = existingItem.quantity + payload.get("quantity")
            updated_item_total =calculate_line_total(float(existingItem.unit_price), float(existingItem.option_total), updatedQuantity)

            existingItem.quantity = updatedQuantity
            existingItem.total_price = updated_item_total
            db.commit() 
            return {"message": "Item successfully added to cart", 
                "cart_item_id": existingItem.id}
        
        if not payload.get("options"):
            option_items = []
        else:
            option_items = flatten_list(payload.get("options"))

        option_total = sum(float(item.get("price_modifier", 0)) for item in option_items)
        item_total_price = calculate_line_total(payload.get("unit_price"), option_total, payload.get("quantity"))

        

        new_cart_item = CartItem(
            cart_id = cart.id,
            product_code = payload.get("product_code"),
            product_id = payload.get("product_id"),
            quantity = payload.get("quantity"),
            unit_price = payload.get("unit_price"),
            option_total= option_total,
            total_price = item_total_price
        )
        db.add(new_cart_item)
        db.flush()

        for option in option_items:
            db.add(CartItemOption(
                cart_item_id= new_cart_item.id,
                option_item_id = option.get("id"),
                option_name = option.get("name"),
                option_price = option.get("price_modifier", 0)
            ))

        db.commit()
        return {"message": "Item successfully added to cart", 
                "cart_item_id": new_cart_item.id}
    
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code= 500, detail=str(e))
    

@router.get('/my-cart')
def get_current_user_cart(user_id= Depends(get_current_user), db: Session = Depends(get_db) ):
    cart = db.query(Cart).options(
        selectinload(Cart.items).selectinload(CartItem.product),
    selectinload(Cart.items).selectinload(CartItem.cart_options),
    ).filter(Cart.user_id == user_id).first()

    if not cart: 
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Cart not Found")
    
    return format_cart(cart)


@router.patch('/{cart_item_id}/quantity')
def update_cart_item(payload: dict, cart_item_id:int, user_id = Depends(get_current_user), db:Session=Depends(get_db)):
    cart_item = db.query(CartItem).filter(CartItem.id == cart_item_id).first()

    if not cart_item:
        HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Cart item not found")    

    user_cart = db.query(Cart).filter(Cart.user_id == user_id).first()

    if not user_cart:
        HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Unauthorized to delete this item")
    
    if payload.get('quantity') <= 0 :
        remove_cart_item(cart_item.id, user_id, db )

        return {'status':"success", 'message': 'Cart item and its options removed successfully'}
    
    has_stock = db.query(Product).filter(Product.id == cart_item.product_id, Product.stock >= payload.get("quantity")).first()
       
    if not has_stock:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Insufficient stock for the requested quantity")
    
    item_total_price = (float(cart_item.unit_price )+ float(cart_item.option_total)) * float(payload.get("quantity"))
    cart_item.quantity = payload.get("quantity")
    cart_item.total_price = item_total_price

    db.commit()
    # db.refresh(cart_item)


@router.delete('/{cart_item_id}')
def remove_cart_item(cart_item_id: int, user_id = Depends(get_current_user), db: Session = Depends(get_db)):
    cart_item = db.query(CartItem).filter(CartItem.id == cart_item_id).first()

    if not cart_item:
        HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Cart item not found")

    user_cart = db.query(Cart).filter(Cart.user_id == user_id).first()

    if not user_cart:
        HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Unauthorized to delete this item")
    
    db.delete(cart_item)
    db.commit()

    return {'status':"success", 'message': 'Cart item and its options removed successfully'}