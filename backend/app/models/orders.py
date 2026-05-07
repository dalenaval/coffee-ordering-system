from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Numeric, Boolean, Text
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
    cancel_requested = Column(Boolean, default=False)
    cancel_reason = Column(Text, nullable=True)
    cancel_requested_at = Column(DateTime(timezone=True), nullable=True)
    cancelled_at = Column(DateTime(timezone=True), nullable=True)
    refund_status = Column(String(50), nullable=True)
    refund_id = Column(String(255), nullable=True)
    refund_reason = Column(Text, nullable=True)

    user = relationship("User")
    payment = relationship("Payment", back_populates="order", uselist=False)
    items = relationship("OrderItem", back_populates="order")

def to_dict(self):
    return {
        column.name: getattr(self, column.name)
        for column in self.__table__.columns
    }