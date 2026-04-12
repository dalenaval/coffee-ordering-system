from sqlalchemy.sql import func
from sqlalchemy import Column, Numeric, Boolean, Text, DateTime, Integer, ForeignKey
from app.db.session import Base
from sqlalchemy.orm import relationship

from app.db.softDeleteMixin import SoftDeleteMixin
from app.db.timeStampMixin import TimeStampMixin

class Product(Base, TimeStampMixin, SoftDeleteMixin):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(Text, nullable=False) 
    description = Column(Text, nullable=True )
    category_id = Column(Integer, ForeignKey("categories.id"), nullable=False, index=True)
    image_url = Column(Text, nullable=True)
    price = Column(Numeric(10,2), nullable=False, index=True)
    is_available = Column(Boolean, default=True)

    category = relationship("Category", back_populates="products", lazy="selectin")
    product_attributes = relationship("ProductAttribute", back_populates="product", lazy="selectin")
    # cart_product = relationship('CartItems', back_populates="product")
