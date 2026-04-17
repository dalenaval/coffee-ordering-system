from fastapi import APIRouter, Depends, HTTPException,status
from sqlalchemy.orm import Session, selectinload

from app.db.deps import get_db
from app.models.product import Product
from app.models.productAttribute import ProductAttribute
from app.models.optionGroup import OptionGroup
from app.schemas.product import ProductResponse
from app.models.category import Category

from app.services.product import format_product

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