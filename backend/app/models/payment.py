from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Numeric
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.db.session import Base

class Payment(Base):
    __tablename__ = "payments"

    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id"), nullable=False)
    payment_method = Column(String(50), nullable=False) # cash, qrph, card, gcash, maya
    payment_status = Column(String(50), nullable=False, default="pending")
    amount = Column(Numeric(10, 2), default=0)
    reference_no = Column(String(100), nullable=True)
    payment_intent_id =Column(String(100), nullable=True)
    payment_method_id =Column(String(50), nullable=True)
    paid_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    order = relationship("Order", back_populates="payment")
    