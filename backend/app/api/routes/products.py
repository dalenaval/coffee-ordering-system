from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, selectinload
from sqlalchemy import select

from uuid import UUID
from app.db.deps import get_db
from app.models.product import Product
from app.models.productAttribute import ProductAttribute
from app.models.optionGroup import OptionGroup
from app.models.optionItems import OptionItem
from app.schemas.product import ProductResponse, ProductDetailsResponse

from app.services.product import format_product

router = APIRouter(prefix ="/products", tags=["Product"])

@router.get('/', response_model=list[ProductResponse])
def get_products(db: Session = Depends(get_db),category_id: int = None):
    db.query(Product)

    query = db.query(Product)
    if category_id:
        query = query.filter(Product.category_id == category_id)

    # query = query.filter(
    #     Product.is_available == True,
    #     Product.deleted_at == None
    #     )

    return query.order_by(Product.created_at.desc()).all()

@router.get('/{productId}', response_model=ProductDetailsResponse)
def get_product_attribute(productId : UUID, db:Session = Depends(get_db)):
        stmt = (select(Product).where(Product.id == productId).options( 
             selectinload(Product.product_attributes)
             .selectinload(ProductAttribute.option_group)
             .selectinload(OptionGroup.items)
        ))

        product = db.execute(stmt).scalar_one_or_none()

        if not product:
             raise HTTPException(status_code=404, details="Product not found")

        return product