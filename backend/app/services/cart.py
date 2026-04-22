from app.models.cart import Cart
from typing import Dict, List, Any
from sqlalchemy.orm import Session


def format_cart(cart:Cart)->dict:
    cart_items = []

    for cart_item in cart.items:
        product = cart_item.product

        options = []

        for item in cart_item.cart_options:
            options.append({
                'id':item.option_item_id,
                'name': item.option_name,
                'price_modifier':item.option_price,
            }) 
        
        option_total = sum(float(option.get("price_modifier", 0)) for option in options)

        base_price = (float(product.price) + option_total)


        cart_items.append({
                'id':cart_item.cart_id,
                'product_id': product.id,
                'quantity':cart_item.quantity,
                'product_name': product.name,
                'cart_item_id':cart_item.id,
                'product_image': product.image_url,
                'unit_price': product.price,
                'option_total':option_total,
                'base_price':base_price,
                'line_total':cart_item.total_price,
                'options':options

        })

        cart_items.sort(key=lambda x: x['cart_item_id'] or 0)

    total_price = sum(float(cart_list.get('line_total', 0))  for cart_list in cart_items)
    
    return {
        "items": cart_items,
        "total_price":total_price
    }

def flatten_list(options: Dict[str, Any]) -> List[Dict[str, Any]]:
    flat_list = []
    for value in options.values():
        if isinstance(value, list):
            flat_list.extend(value)
        elif isinstance(value, dict):
            flat_list.append(value)
    return flat_list

def get_or_create_cart(db:Session, user_id : int) -> Cart:
    cart = db.query(Cart).filter(Cart.user_id == user_id).first()

    if not cart:
        cart = Cart(user_id = user_id)
        db.add(cart)
        db.commit()
        db.refresh(cart)

    return cart
