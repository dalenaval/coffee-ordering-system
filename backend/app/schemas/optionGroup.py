from pydantic import BaseModel, ConfigDict
from typing import Optional
from app.schemas.optionItems import OptionItemResponse
from typing import List

class OptionGroupBase(BaseModel):
    name: str
    max_count: int
    is_required: bool

class OptionGroupCreate(OptionGroupBase):
    pass

class UpdateOptionGroup(BaseModel):
    name: Optional[str]
    max_count: Optional[int]
    is_required: Optional[bool]

class OptionGroupResponse(OptionGroupBase):
    id: int
    items:List[OptionItemResponse]

    model_config = ConfigDict(from_attributes=True)