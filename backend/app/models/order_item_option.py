from sqlalchemy import Column, Integer, ForeignKey, Text, Numeric
from app.db.session import Base
from sqlalchemy.orm import relationship

class OrderItemOption(Base):
    __tablename__ = "order_item_options"

    id=Column(Integer, primary_key=True, autoincrement=True)
    order_item_id=Column(Integer, ForeignKey('order_items.id'), index=True)
    option_item_id = Column(Integer, ForeignKey('option_items.id'), nullable=False)
    option_name = Column(Text, nullable=False)
    option_price = Column(Numeric(10,2))
    
    options = relationship('OptionItem')
    order_item = relationship('OrderItem')