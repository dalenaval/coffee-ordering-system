from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.deps import get_db
from app.models.product import Product
from app.schemas.product import ProductResponse


router = APIRouter(prefix ="/products", tags=["Product"])

@router.get('/', response_model=list[ProductResponse])
def get_products(db: Session = Depends(get_db),category_id: int = None):
    db.query(Product)

    query = db.query(Product)
    if category_id:
        query = query.filter(Product.category_id == category_id)

    return query.order_by(Product.created_at.desc()).all()

