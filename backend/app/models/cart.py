
from sqlalchemy import Column, Integer, ForeignKey, String
from app.db.session import Base
from sqlalchemy.orm import relationship

from app.db.timeStampMixin import TimeStampMixin

class Cart(Base, TimeStampMixin):
    __table__ = "cart"

    id=Column(Integer, primary_key=True, nullable=True )
    user_id = Column(Integer, ForeignKey('users.id'), nullable=True, index=True)
    session_id = Column(String, nullable=True, index=True)

    # items = relationship("Cart", back_populates="cart_list") 
    # cart = relationship("User", back_populates="user_cart")
    