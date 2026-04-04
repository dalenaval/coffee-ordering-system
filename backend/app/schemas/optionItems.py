from pydantic import BaseModel, ConfigDict
from decimal import Decimal
from typing import Optional


class OptionItem(BaseModel):
    name: str
    price: Decimal
    display_order: int

class OptionItemCreate(OptionItem):
    pass

class OptionItemUpdate(BaseModel):
    name: Optional[str] 
    price: Optional[Decimal]
    display_order: Optional[int]

class OptionItemResponse(BaseModel):
    name: str
    price: Decimal
    display_order: int

    model_config = ConfigDict(from_attributes=True)