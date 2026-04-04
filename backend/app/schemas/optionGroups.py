from pydantic import BaseModel, ConfigDict
from typing import Optional


class OptionGroupBase(BaseModel):
    name: str
    max_count: int
    display_order: int
    is_required: bool

class OptionGroupCreate(OptionGroupBase):
    pass

class UpdateOptionGroup(BaseModel):
    name: Optional[str]
    max_count: Optional[int]
    display_order: Optional[int]
    is_required: Optional[bool]

class OptionGroupResponse(BaseModel):
    display_order: int
    name: str
    max_count: int
    is_required: bool

    model_config = ConfigDict(from_attributes=True)