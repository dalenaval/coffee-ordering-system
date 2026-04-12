from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.deps import get_db
from app.models.product import Product
from app.models.category import Category

router = APIRouter(prefix="/menu", tags=["Menu"])

@router.get("/")
def get_menu_items(db: Session = Depends(get_db)):
    rows = (
        db.query(Product, Category)
        .join(Category, Product.category_id == Category.id)
        .order_by(Product.id.desc())
        .all()
    )

    result = []
    for product, category in rows:
        result.append({
            "id": product.id,
            "name": product.name,
            "category": category.name,
            "price": float(product.price),
            "is_available": product.is_available,
        })

    return result
