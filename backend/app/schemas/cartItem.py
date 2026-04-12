from pydantic import BaseModel, ConfigDict
from decimal import Decimal
from typing import Optional

class CreateCartItem(BaseModel):
    cart_id = int
    product_id = int
    quantity = int
    unit_price = Decimal

class UpdateCartItem(BaseModel):
    cart_id = Optional[int]
    product_id = Optional[int]
    quantity = Optional[int]
    unit_price = Optional[Decimal]

# class CartItemResponse(BaseModel):
#     product