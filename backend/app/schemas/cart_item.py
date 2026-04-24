from pydantic import BaseModel, ConfigDict
from decimal import Decimal
from typing import Optional

class CreateCartItem(BaseModel):
    cart_id = int
    product_id = int
    product_code = str
    quantity = int
    unit_price = Decimal
    option_total = Decimal

class UpdateCartItem(BaseModel):
    cart_id = Optional[int]
    product_code = Optional[str]
    product_id = Optional[int]
    quantity = Optional[int]
    unit_price = Optional[Decimal]
    option_total = Decimal

# class CartItemResponse(BaseModel):
#     product