from sqlalchemy import Integer, Column, SmallInteger, Text, Numeric, Boolean, ForeignKey
from app.db.session import Base
from app.db.softDeleteMixin import SoftDeleteMixin
from sqlalchemy.orm import relationship

from app.db.timeStampMixin import TimeStampMixin

class OptionItem(Base, TimeStampMixin, SoftDeleteMixin):
    __tablename__ = "option_items"

    id = Column(Integer, primary_key=True, index=True)
    option_group_id = Column(Integer, ForeignKey("option_groups.id"), nullable=False, index=True)
    name = Column(Text)
    price_modifier = Column(Numeric(9, 2))
    display_order = Column(SmallInteger)
    is_default = Column(Boolean, default=False) 

    group = relationship("OptionGroup", back_populates="items")   
    cart_attributes = relationship('CartItemOption', back_populates='options')