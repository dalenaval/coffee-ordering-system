from sqlalchemy import Column, Integer, String, Text
from app.db.session import Base

class SystemSetting(Base):
    __tablename__ = "system_settings"

    id = Column(Integer, primary_key=True, autoincrement=True)
    setting_key = Column(String(100), nullable=False, unique=True)
    setting_value = Column(String(100), nullable=False)
    description = Column(Text, nullable=True)
    