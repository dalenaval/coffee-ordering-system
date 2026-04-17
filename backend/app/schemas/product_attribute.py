from pydantic import BaseModel, ConfigDict
from backend.app.schemas.option_group import OptionGroupResponse
from typing import  List

class ProductAttributeBase(BaseModel):
    product_id: int
    option_group_id: int
    display_order: int    

class ProductAttributeCreate(ProductAttributeBase):
    pass

class ProductAttributeResponse(BaseModel):
    id:int
    display_order:int
    option_group: OptionGroupResponse

    model_config = ConfigDict(from_attributes=True)