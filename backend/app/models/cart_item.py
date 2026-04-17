from sqlalchemy import Column, Integer, ForeignKey, String, Numeric
from app.db.session import Base
from sqlalchemy.orm import relationship

from app.db.timeStampMixin import TimeStampMixin

class CartItem(Base, TimeStampMixin):
    __tablename__ ="cart_items"

    id=Column(Integer, primary_key=True, index=True)
    cart_id = Column(Integer, ForeignKey('cart.id'), index=True )
    product_id = Column(Integer, ForeignKey('products.id'), nullable=False, index=True)
    quantity = Column(Integer, default=1)
    unit_price = Column(Numeric(10,2))
    option_total = Column(Numeric(10,2))
    total_price = Column(Numeric(10,2))  # (unit price + option_total) * quantity

    product = relationship("Product", back_populates="cart_product")
    cart_list = relationship("Cart", back_populates="items")
    cart_options = relationship('CartItemOption', back_populates="cart_item", cascade="all, delete-orphan", passive_deletes=True)