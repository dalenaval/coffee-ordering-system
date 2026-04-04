
from fastapi import APIRouter, Depends,HTTPException, status
from sqlalchemy.orm import Session
from app.db.deps import get_db
from app.models.optionGroups import OptionGroup
from app.schemas.optionGroups import OptionGroupResponse, OptionGroupCreate

router = APIRouter(prefix ="/option-groups", tags=["OptionGroup"])

@router.get('/', response_model=list[OptionGroupResponse])
def get_option_groups(db:Session = Depends(get_db)):
    return db.query(OptionGroup).order_by(OptionGroup.display_order.desc()).all()

@router.post('/', response_model=OptionGroupResponse)
def create_option_group(payload: OptionGroupCreate, db: Session = Depends(get_db)):
    existing_option_group = db.query(OptionGroup).filter(OptionGroup.name == payload.name).first()
    if existing_option_group:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Option group with this {payload.name} already exists."
        )

    new_option_group = OptionGroup(**payload.model_dump())
    
    try:
        db.add(new_option_group)
        db.commit()
        db.refresh(new_option_group)
        return new_option_group
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred while creating the option group: {str(e)}"
        )

   