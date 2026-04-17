from sqlalchemy.sql import func
from sqlalchemy import Column, Numeric, Boolean, Text, DateTime, Integer, ForeignKey
from app.db.session import Base
from sqlalchemy.orm import relationship

class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(Text, nullable=False) 
    description = Column(Text, nullable=True )
    category_id = Column(Integer, ForeignKey("categories.id"), nullable=False, index=True)
    image_url = Column(Text, nullable=True)
    price = Column(Numeric(10,2), nullable=False, index=True)
    is_available = Column(Boolean, default=True)
    stock = Column(Integer, nullable=False, default=1)
    low_stock_threshold = Column(Integer, nullable=False, default=5)

    category = relationship("Category", back_populates="products")
    product_attributes = relationship("ProductAttribute", back_populates="product")
    cart_product = relationship('CartItem', back_populates="product")
