from sqlalchemy import Column, Integer, String, Double, DateTime
from sqlalchemy.sql import func
from app.db.session import Base


class Option(Base):
    __tablename__ = "options"

    id = Column(Integer, primary_key=True)
    group_id = Column(Integer)
    name = Column(String)
    price_modifier = Column(Double)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), index=True)