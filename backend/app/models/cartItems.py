from sqlalchemy import Column, Integer, ForeignKey, String, Numeric
from app.db.session import Base
from sqlalchemy.orm import relationship

from app.db.timeStampMixin import TimeStampMixin

class CartItems(Base, TimeStampMixin):
    __table__ ="cart_items"

    id=Column(Integer, primary_key=True, index=True)
    cart_id = Column(Integer, ForeignKey('cart.id'), index=True )
    product_id = Column(Integer, ForeignKey('products.id'), nullable=False, index=True)
    quantity = Column(Integer, default=1)
    unit_price = Column(Numeric(10,2))

    # cart_list = relationship("CartItems", back_populates="items")
    # cart_options = relationship('CartItemOptions', back_populates="cart_item")
    # product = relationship("Product", back_populates="cart_product")