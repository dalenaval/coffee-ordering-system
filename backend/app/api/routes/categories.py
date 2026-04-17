from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.deps import get_db
from app.models.category import Category
from app.schemas.category import CategoryResponse


router = APIRouter(prefix ="/categories", tags=["Categories"])

@router.get('/', response_model=list[CategoryResponse])
def get_categories(db: Session = Depends(get_db)):
    return db.query(Category).order_by(Category.created_at.desc()).all()

@router.get('/active', response_model=list[CategoryResponse])
def get_categories(db: Session = Depends(get_db)):
    return db.query(Category).where(Category.is_active == True).order_by(Category.created_at.desc()).all()
