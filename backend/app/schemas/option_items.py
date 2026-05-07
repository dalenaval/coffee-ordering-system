from pydantic import BaseModel, ConfigDict
from decimal import Decimal
from typing import Optional

class OptionItemCreate(BaseModel):
    name: str
    option_group_id: int
    price_modifier: Decimal
    is_default:bool
    display_order: int

class OptionItemUpdate(BaseModel):
    name: Optional[str] 
    option_group_id: Optional[int]
    price_modifier: Optional[Decimal]
    is_default:Optional[bool]
    display_order: Optional[int]


class OptionItemResponse(BaseModel):
    id:int
    name: str
    option_group_id: int
    price_modifier: Decimal
    is_default:bool
    display_order: int
   
    model_config = ConfigDict(from_attributes=True)