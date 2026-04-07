from pydantic import BaseModel, ConfigDict
from uuid import UUID
from app.schemas.optionGroup import OptionGroupResponse
from typing import  List

class ProductAttributeBase(BaseModel):
    product_id: UUID
    option_group_id: int
    display_order: int    

class ProductAttributeCreate(ProductAttributeBase):
    pass

class ProductAttributeResponse(BaseModel):
    id:int
    display_order:int
    option_group: OptionGroupResponse

    model_config = ConfigDict(from_attributes=True)