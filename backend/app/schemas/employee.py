from pydantic import BaseModel, EmailStr
from typing import Optional

class EmployeeCreate(BaseModel):
    full_name: str
    email: Optional[EmailStr] = None
    contact_no: Optional[str] = None
    position: str
    role: str
    employment_status: str = "Active"
    is_active: bool = True

    create_login_account: bool = False
    login_email: Optional[EmailStr] = None
    login_password: Optional[str] = None


class EmployeeUpdate(BaseModel):
    full_name: str
    email: Optional[EmailStr] = None
    contact_no: Optional[str] = None
    position: str
    role: str
    employment_status: str = "Active"
    is_active: bool = True


class EmployeeToggleStatus(BaseModel):
    is_active: bool
    