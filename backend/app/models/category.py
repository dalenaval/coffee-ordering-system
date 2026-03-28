
from sqlalchemy import Column, Integer, String, DateTime
from app.db.session import Base
from sqlalchemy.sql import func

class Category(Base):
    __tablename__ = "categories"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False) 
    created_at = Column(DateTime(timezone=True), server_default=func.now(), index=True)