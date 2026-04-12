from pydantic import BaseModel, ConfigDict
from decimal import Decimal
from typing import Optional


class OptionItemBase(BaseModel):
    name: str
    option_group_id: int
    price_modifier: Decimal
    display_order: int

class OptionItemCreate(OptionItemBase):
    pass

class OptionItemUpdate(BaseModel):
    name: Optional[str] 
    option_group_id: Optional[int]
    price_modifier: Optional[Decimal]
    display_order: Optional[int]

class OptionItemResponse(BaseModel):
    id: int
    name:str
    price_modifier:Decimal
    display_order: int
   
    model_config = ConfigDict(from_attributes=True)