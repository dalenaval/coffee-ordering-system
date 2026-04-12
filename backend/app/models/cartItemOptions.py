from sqlalchemy import Column, Integer, ForeignKey
from app.db.session import Base
from sqlalchemy.orm import relationship

from app.db.timeStampMixin import TimeStampMixin

class CartItemOptions (Base, TimeStampMixin):
    __table__ = "cart_item_options"

    id=Column(Integer, primary_key=True)
    cart_item_id=Column(Integer, ForeignKey('cart_items.id'), nullable=False, index=True)
    option_item_id = Column(Integer, ForeignKey('option_items.id'), nullable=False, index=True)

    # cart_item = relationship('CartItems', back_populates='cart_options')
    # options = relationship('OptionItems', back_populates='cart_attributes')
