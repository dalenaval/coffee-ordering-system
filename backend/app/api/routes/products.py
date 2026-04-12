from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, selectinload
from sqlalchemy import select

from app.db.deps import get_db
from app.models.product import Product
from app.models.productAttribute import ProductAttribute
from app.models.optionGroup import OptionGroup
from app.models.optionItems import OptionItem
from app.schemas.product import ProductResponse, ProductDetailsResponse
from app.models.category import Category

from app.services.product import format_product

router = APIRouter(prefix ="/products", tags=["Product"])

@router.get('/', response_model=list[ProductResponse])
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

@router.get('/{productId}')
def get_product_attribute(productId : int, db:Session = Depends(get_db)):
        stmt = (select(Product).where(Product.id == productId).options( 
             selectinload(Product.product_attributes)
             .selectinload(ProductAttribute.option_group)
             .selectinload(OptionGroup.items)
        ))

        product = db.execute(stmt).scalar_one_or_none()

        if not product:
             raise HTTPException(status_code=404, details="Product not found")

        return format_product(product)