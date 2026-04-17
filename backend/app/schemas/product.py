from pydantic import BaseModel, ConfigDict, Field
from datetime import datetime
from uuid import UUID
from decimal import Decimal
from typing import Optional, List
from app.schemas.category import CategoryResponse

class ProductBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    description: Optional[str] = Field(None, max_length=500)
    price: Decimal = Field(..., gt=0, max_digits=10, decimal_places=2)
    category_id: int
    image_url: Optional[str] = Field(None, max_length=2048)
    stock:int
    low_stock_threshold:int
    is_available: bool 
class ProductCreate(ProductBase):
    pass

class ProductUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=100)
    description: Optional[str] = Field(None, max_length=500)
    price: Optional[Decimal] = Field(None, gt=0, max_digits=10, decimal_places=2)
    category_id: Optional[int] = None
    image_url: Optional[str] = Field(None, max_length=2048)
    stock:Optional[int]
    low_stock_threshold:Optional[int]
    is_available: Optional[bool] = None

# class ProductDetailsResponse(BaseModel):
#     product_attributes: List[ProductAttributesResponse]

#     model_config = ConfigDict(from_attributes=True)

class ProductResponse(BaseModel):
    id: int
    name: str
    description: Optional[str] = None
    price: Decimal
    image_url: Optional[str] = None
    stock:int
    low_stock_threshold:int
    is_available: bool

    category: Optional[CategoryResponse] = None

    model_config = ConfigDict(from_attributes=True)