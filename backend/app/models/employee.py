from sqlalchemy import Column, Integer, String, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from app.db.session import Base

class Employee(Base):
    __tablename__ = "employees"

    id = Column(Integer, primary_key=True, autoincrement=True)
    full_name = Column(String(150), nullable=False)
    email = Column(String(150), nullable=True, unique=True)
    contact_no = Column(String(50), nullable=True)
    position = Column(String(100), nullable=False)
    role = Column(String(50), nullable=False, default="staff")
    employment_status = Column(String(50), nullable=False, default="Active")
    is_active = Column(Boolean, default=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)

    user = relationship("User", foreign_keys=[user_id], lazy="joined")
    