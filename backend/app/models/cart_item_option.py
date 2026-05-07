from sqlalchemy import Column, Integer, ForeignKey, Text,Numeric
from app.db.session import Base
from sqlalchemy.orm import relationship

from app.db.timeStampMixin import TimeStampMixin

class CartItemOption (Base, TimeStampMixin):
    __tablename__ = "cart_item_options"

    id=Column(Integer, primary_key=True)
    cart_item_id=Column(Integer, ForeignKey('cart_items.id', ondelete="CASCADE"), nullable=False, index=True)
    option_item_id = Column(Integer, ForeignKey('option_items.id'), nullable=False, index=True)
    option_name = Column(Text, nullable=False)
    option_price = Column(Numeric(10,2))

    options = relationship('OptionItem', back_populates='cart_attributes')
    cart_item = relationship('CartItem', back_populates='cart_options')

