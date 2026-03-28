import uuid6
from sqlalchemy.sql import func
from sqlalchemy import Column, String, Numeric, Boolean, Text, DateTime, Enum
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import declarative_base

Base = declarative_base()

class Product(Base):
    __tablename__ = "products"

    id = Column(
         UUID(as_uuid=True),
        primary_key=True,
        default=uuid6.uuid7
    )
    name = Column(String(100), nullable=False) 
    description = Column(Text, nullable=True )
    category = Column(Enum("coffee", "tea", "pastry", name="product_category"))
    image_url = Column(Text, nullable=True, index=True)
    price = Column(Numeric(10,2), nullable=False, index=True)
    is_available = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), index=True)