from pydantic import BaseModel, ConfigDict
from decimal import Decimal
from typing import List

class CartItemOptionCreate(BaseModel):
    id:int
    name:str
    price_modifier:Decimal
    
class AddToCartRequest(BaseModel):
    user_id: int
    product_id: int
    quantity:int
    base_price: Decimal
    unit_price:Decimal
    total_price:Decimal
    options:List[CartItemOptionCreate] = []

class CartResponse(BaseModel):
    userId:int

    model_config = ConfigDict(from_attributes=True)
