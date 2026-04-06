from sqlalchemy import Column, Integer, ForeignKey, BigInteger,UUID
from app.db.session import Base
from sqlalchemy.orm import relationship

from app.db.timeStampMixin import TimeStampMixin

class ProductAttribute(Base, TimeStampMixin):
    __tablename__ = "product_attributes"

    id=Column(BigInteger, primary_key=True)
    product_id = Column(UUID, ForeignKey("products.id"))
    option_group_id = Column(BigInteger, ForeignKey("option_groups.id"))
    display_order = Column(Integer)

    product = relationship("Product", back_populates="product_attributes")
    option_group = relationship("OptionGroup")