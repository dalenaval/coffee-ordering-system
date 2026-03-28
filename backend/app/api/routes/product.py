from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.deps import get_db
from app.models.product import Product
from app.schemas.product import ProductResponse


router = APIRouter(prefix ="/products", tags=["Products"])

@router.get('/', response_model=list[ProductResponse])
def get_products(db: Session = Depends(get_db)):
    return db.query(Product).order_by(Product.created_at.desc()).all()