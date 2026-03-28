from sqlalchemy import Column, Integer, String, Boolean
from app.db.session import Base

class OptionGroup(Base):
    __tablename__ = "option_groups"

    id = Column(Integer, primary_key=True)
    name = Column(String)
    required = Column(Boolean)
    max_select = Column(Integer)