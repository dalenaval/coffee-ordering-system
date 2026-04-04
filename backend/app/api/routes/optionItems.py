from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.deps import get_db
from app.models.optionItems import OptionItem
from app.schemas.optionItems import OptionItemResponse

router = APIRouter(prefix="/option-items", tags=["OptionItem"])

@router.get('/', response_model=list[OptionItemResponse])
def get_option_items(db:Session = Depends(get_db)):
    return db.query(OptionItem).order_by(OptionItem.display_order.asc()).all()