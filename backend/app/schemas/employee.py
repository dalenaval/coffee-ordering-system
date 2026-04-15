from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

class EmployeeBase(BaseModel):
    employee_code: str
    full_name: str
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    role: str
    department: Optional[str] = None
    employment_type: Optional[str] = None
    is_active: bool = True

class EmployeeCreate(EmployeeBase):
    pass

class EmployeeUpdate(BaseModel):
    employee_code: Optional[str] = None
    full_name: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    role: Optional[str] = None
    department: Optional[str] = None
    employment_type: Optional[str] = None
    is_active: Optional[bool] = None

class EmployeeOut(EmployeeBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True
