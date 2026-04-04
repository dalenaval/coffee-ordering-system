from sqlalchemy import BigInteger, Column, SmallInteger, Text, Numeric, DateTime, ForeignKey
from sqlalchemy.sql import func
from app.db.session import Base
from app.db.softDeleteMixin import SoftDeleteMixin
from sqlalchemy.orm import relationship

from app.db.timeStampMixin import TimeStampMixin

class OptionItem(Base,TimeStampMixin, SoftDeleteMixin):
    __tablename__ = "option_items"

    id = Column(BigInteger, primary_key=True)
    group_id = Column(BigInteger, ForeignKey("option_groups.id"), nullable=False, index=True)
    name = Column(Text)
    price_modifier = Column(Numeric(9, 2))
    display_order = Column(SmallInteger)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    group = relationship("OptionGroup", back_populates="items")   