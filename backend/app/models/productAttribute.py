from sqlalchemy import Column, Integer, ForeignKey
from app.db.session import Base
from sqlalchemy.orm import relationship

from app.db.timeStampMixin import TimeStampMixin

class ProductAttribute(Base, TimeStampMixin):
    __tablename__ = "product_attributes"

    id=Column(Integer, primary_key=True)
    product_id = Column(Integer, ForeignKey("products.id"))
    option_group_id = Column(Integer, ForeignKey("option_groups.id"))
    display_order = Column(Integer)

    product = relationship("Product", back_populates="product_attributes")
    option_group = relationship("OptionGroup", back_populates="product_attributes")