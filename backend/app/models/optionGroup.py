from sqlalchemy import Column, Integer, String, Boolean, BigInteger
from app.db.session import Base
from app.db.softDeleteMixin import SoftDeleteMixin
from app.db.timeStampMixin import TimeStampMixin
from sqlalchemy.orm import relationship


class OptionGroup(Base, TimeStampMixin, SoftDeleteMixin):   
    __tablename__ = "option_groups"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    max_count = Column(Integer)
    is_required = Column(Boolean, default=False)

    items =  relationship("OptionItem", back_populates="group")
    product_attributes = relationship("ProductAttribute", back_populates="option_group")