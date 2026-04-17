from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text
from sqlalchemy.sql import func
from app.db.session import Base
from sqlalchemy.orm import relationship

from app.db.timeStampMixin import TimeStampMixin

class Category(Base, TimeStampMixin):
    __tablename__ = "categories"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(Text, nullable=False, unique=True)
    # description = Column(String(255), nullable=True)
    is_active = Column(Boolean, default=True)
    # created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    products = relationship("Product", back_populates="category")

