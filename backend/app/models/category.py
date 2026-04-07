
from sqlalchemy import Column, Integer, Text
from app.db.session import Base
from sqlalchemy.orm import relationship

from app.db.timeStampMixin import TimeStampMixin

class Category(Base, TimeStampMixin):
    __tablename__ = "categories"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(Text, nullable=False, unique=True) 

    products = relationship("Product", back_populates="category")