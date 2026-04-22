from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Numeric
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.db.session import Base

from app.db.timeStampMixin import TimeStampMixin

class Order(Base, TimeStampMixin):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)
    order_no = Column(String(50), unique=True, nullable=False, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    email = Column(String(100), nullable=True)
    phone = Column(Integer, nullable=True)
    order_type = Column(String(50), nullable=False)  # Dine-in, Pickup, Takeout
    status = Column(String(50), nullable=False, default="Pending")
    subtotal = Column(Numeric(10, 2), nullable=False, default=0)
    total_amount = Column(Numeric(10, 2), nullable=False, default=0)
    # created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User")
    payment = relationship("Payment", back_populates="order")
