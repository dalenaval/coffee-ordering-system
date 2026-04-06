from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.deps import get_db
from app.models.optionItems import OptionItem
from app.schemas.optionItems import OptionItemResponse, OptionItemCreate

router = APIRouter(prefix="/option-items", tags=["OptionItem"])

@router.get('/', response_model=list[OptionItemResponse])
def get_option_items(db:Session = Depends(get_db)):
    return db.query(OptionItem).order_by(OptionItem.option_group_id.asc(), OptionItem.display_order.asc()).all()

@router.post('/', response_model=OptionItemResponse)
def create_option_item(payload: OptionItemCreate, db:Session = Depends(get_db)):
    existing_option_item = db.query(OptionItem).filter(OptionItem.name == payload.name).first()
    if existing_option_item:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"{payload.name} already exists."
        )

    new_option_item = OptionItem(**payload.model_dump())
    
    max_order = db.execute(db.query(OptionItem.max(OptionItem.display_order)
                                    .filter(OptionItem.option_group_id == new_option_item.option_group_id))
                                    ).scalar()
    
    new_option_item.display_order = (max_order or 0) + 10

    try:
        db.add(new_option_item)
        db.commit()
        db.refresh(new_option_item)
        return new_option_item
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred while creating the option item: {str(e)}"
        ) 