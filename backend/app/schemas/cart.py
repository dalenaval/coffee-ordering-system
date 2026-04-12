from pydantic import BaseModel, ConfigDict
from typing import Optional

class CartCreate(BaseModel):
    userId: Optional[int]
    sessionId: Optional[str]

class UpdateCart(CartCreate):
    pass

# class CartResponse(BaseModel):
    