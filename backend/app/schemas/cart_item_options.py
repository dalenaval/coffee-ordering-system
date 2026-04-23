from pydantic import BaseModel, ConfigDict
from typing import Optional

class  CartItemOptionBase(BaseModel):
    cart_item_id:int
    option_item_id:int
    option_name:str
    option_price:int

class CreateCartItemOption(CartItemOptionBase):
    pass

class UpdateCartItemOption(BaseModel):
    cart_item_id:Optional[int]
    option_item_id:Optional[int]
    option_name:Optional[str]
    option_price:Optional[int]

class CartItemOptionResponse(CartItemOptionBase):
    id:int

    model_config = ConfigDict(from_attributes=True)