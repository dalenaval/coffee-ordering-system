
from sqlalchemy import Column, Integer, ForeignKey
from app.db.session import Base
from sqlalchemy.orm import relationship

from app.db.timeStampMixin import TimeStampMixin

class Cart(Base, TimeStampMixin):
    __tablename__ = "cart"

    id=Column(Integer, primary_key=True )
    user_id = Column(Integer, ForeignKey('users.id'), nullable=True, index=True)

    items = relationship("CartItem", back_populates="cart_list") 
    cart = relationship("User", back_populates="user_cart")
    # items = relationship("CartItem")
    # cart = relationship("User")
    