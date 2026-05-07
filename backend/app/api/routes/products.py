from fastapi import APIRouter, Depends, HTTPException,status
from sqlalchemy.orm import Session, selectinload

from app.db.deps import get_db
from app.models.product import Product
from app.models.product_attribute import ProductAttribute
from app.models.option_group import OptionGroup
from app.models.category import Category

from app.services.product import format_product
from app.models.stock_log import StockLog

router = APIRouter(prefix ="/products", tags=["Product"])

@router.get('/')
def get_products(db: Session = Depends(get_db)):
    rows = (
        db.query(Product, Category)
        .join(Category, Product.category_id == Category.id)
        .order_by(Product.name.asc())
        .all()
    )

    return [
        {
            "id": product.id,
            "name": product.name,
            "description": product.description,
            "category": category.name,
            "price": float(product.price),
            "stock": float(product.stock),
            "low_stock_threshold": float(product.low_stock_threshold),
            "is_available": product.is_available,
        }
        for product, category in rows
    ]

@router.get('/{product_id}/attributes')
async def get_product_attribute(product_id : int, db:Session = Depends(get_db)):
        
    product = (db.query(Product).options( 
            selectinload(Product.product_attributes)
            .selectinload(ProductAttribute.option_group)
            .selectinload(OptionGroup.items)
            )
            .filter(Product.id == product_id)
            .first())

    if not product:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")
    
    return format_product(product)
    
@router.get("/low-stock")
def get_low_stock_products(db: Session = Depends(get_db)):
    products = (
        db.query(Product)
        .filter(Product.stock <= Product.low_stock_threshold)
        .order_by(Product.stock.asc())
        .all()
    )

    return [
        {
            "id": p.id,
            "name": p.name,
            "stock": p.stock,
            "low_stock_threshold": p.low_stock_threshold,
            "status": "OUT OF STOCK" if p.stock == 0 else "LOW STOCK"
        }
        for p in products
    ]

@router.post("/{product_id}/restock")
def restock_product(product_id: int, payload: dict, db: Session = Depends(get_db)):
    qty = int(payload.get("quantity", 0))
    remarks = payload.get("remarks")

    if qty <= 0:
        raise HTTPException(status_code=400, detail="Restock quantity must be greater than 0.")

    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found.")

    product.stock += qty

    log = StockLog(
        product_id=product.id,
        change_qty=qty,
        movement_type="RESTOCK",
        remarks=remarks
    )

    db.add(log)
    db.commit()
    db.refresh(product)

    return {
        "message": "Product restocked successfully.",
        "product": {
            "id": product.id,
            "name": product.name,
            "stock": product.stock
        }
    }
