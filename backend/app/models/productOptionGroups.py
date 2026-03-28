
from sqlalchemy import Column, Integer
from app.db.session import Base

class ProductOptionGroup(Base):
    __tablename__ = "product_option_groups"

    id = Column(Integer, primary_key=True)
    product_id = Column(Integer)
    group_id = Column(Integer)