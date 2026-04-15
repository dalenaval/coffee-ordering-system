from sqlalchemy import Column, Integer, String, Boolean
from app.db.session import Base

class Employee(Base):
    __tablename__ = "employees"

    id = Column(Integer, primary_key=True, autoincrement=True)
    full_name = Column(String(150), nullable=False)
    position = Column(String(100), nullable=False)
    employment_status = Column(String(50), nullable=False, default="Active")
    is_active = Column(Boolean, default=True)
    