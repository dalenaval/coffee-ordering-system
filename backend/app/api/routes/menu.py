from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session, joinedload
from app.db.deps import get_db
from app.models.product import Product
from app.models.category import Category


from app.schemas.product import ProductResponse

router = APIRouter(prefix="/menu", tags=["Menu"])

@router.get("/", response_model=list[ProductResponse])
def get_menu_items(
    db: Session = Depends(get_db), 
    category_id : int | None = Query (None, description='Filter by Category ID')):

    query = db.query(Product).options(joinedload(Product.category))

    if(category_id) :
       query = query.filter(Product.category_id == category_id)

    return  query.order_by(Product.id.desc()).all()