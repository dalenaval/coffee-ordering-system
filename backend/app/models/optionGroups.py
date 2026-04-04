from sqlalchemy import Column, Integer, String, Boolean
from app.db.session import Base
from app.db.softDeleteMixin import SoftDeleteMixin
from app.db.timeStampMixin import TimeStampMixin
from sqlalchemy.orm import relationship


class OptionGroup(Base, TimeStampMixin, SoftDeleteMixin):   
    __tablename__ = "option_groups"

    id = Column(Integer, primary_key=True)
    name = Column(String)
    max_count = Column(Integer)
    display_order = Column(Integer)
    is_required = Column(Boolean, default=False)

    items =  relationship("OptionItem", back_populates="group")