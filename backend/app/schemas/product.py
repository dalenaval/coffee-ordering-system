from pydantic import BaseModel, Field
from datetime import datetime
from uuid import UUID
from decimal import Decimal

class ProductBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    description: str | None = Field("", max_length=500) 
    price: Decimal = Field(..., gt=0, max_digits=10, decimal_places=2)
    category: str = Field(..., min_length=1, max_length=50)
    image_url: str = Field("", max_length=2048)
    is_available: bool = True 

class ProductCreate(ProductBase):
    pass

class ProductUpdate(BaseModel):
    name: str | None = Field(None, min_length=1, max_length=100)
    description: str | None = Field(None, max_length=500)
    price: Decimal | None = Field(None, gt=0, max_digits=10, decimal_places=2)
    category: str | None = Field(None, min_length=1, max_length=50)
    image_url: str | None = Field(None, max_length=2048)
    is_available: bool | None = None

class ProductResponse(ProductBase):
    id: UUID
    created_at: datetime

    # ✅ Crucial for Pydantic V2 to read SQLAlchemy Database Objects
    model_config = {
        "from_attributes": True
    }