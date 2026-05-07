from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session, joinedload
from app.db.deps import get_db
from app.models.product import Product
from app.models.category import Category


from app.schemas.product import MenuResponse

router = APIRouter(prefix="/menu", tags=["Menu"])

@router.get("/", response_model=list[MenuResponse])
def get_menu_items(
    db: Session = Depends(get_db), 
    category_id : int | None = Query (None, description='Filter by Category ID')):

    query = db.query(Product).options(joinedload(Product.category))

    if(category_id) :
       query = query.filter(Product.category_id == category_id)

    return  query.order_by((Product.stock == 0),Product.id.desc()).all()

# router = APIRouter(prefix="/menu", tags=["Menu"])

# @router.get("/")
# def get_menu_items2(db: Session = Depends(get_db)):
#     rows = (
#         db.query(Product, Category)
#         .join(Category, Product.category_id == Category.id)
#         .order_by(Product.id.desc())
#         .all()
#     )

#     result = []
#     for product, category in rows:
#         result.append({
#             "id": product.id,
#             "name": product.name,
#             "category": category.name,
#             "price": float(product.price),
#             "is_available": product.is_available,
#         })

#     return result
