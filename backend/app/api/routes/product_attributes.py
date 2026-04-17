from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.deps import get_db
from backend.app.models.product_attribute import ProductAttribute
from backend.app.schemas.product_attribute import ProductAttributeResponse

router = APIRouter(prefix="/product-attributes", tags=["ProductAttibute"])

@router.get('/', response_model=list[ProductAttributeResponse])
def get_product(db:Session = Depends(get_db)):
    return db.query(ProductAttribute).order_by(ProductAttribute.product_id.desc(), ProductAttribute.display_order.asc()).all()


