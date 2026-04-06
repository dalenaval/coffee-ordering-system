import uuid6
from sqlalchemy.sql import func
from sqlalchemy import Column, Numeric, Boolean, Text, DateTime, Integer, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from app.db.session import Base
from sqlalchemy.orm import relationship

from app.db.softDeleteMixin import SoftDeleteMixin
from app.db.timeStampMixin import TimeStampMixin

class Product(Base, TimeStampMixin, SoftDeleteMixin):
    __tablename__ = "products"

    id = Column(
         UUID(as_uuid=True),
        primary_key=True,
        default=uuid6.uuid7
    )
    name = Column(Text, nullable=False) 
    description = Column(Text, nullable=True )
    category_id = Column(Integer, ForeignKey("categories.id"), nullable=False, index=True)
    image_url = Column(Text, nullable=True, index=True)
    price = Column(Numeric(10,2), nullable=False, index=True)
    is_available = Column(Boolean, default=True)

    category = relationship("Category", back_populates="products")
    product_attributes = relationship("ProductAttribute", back_populates="product")