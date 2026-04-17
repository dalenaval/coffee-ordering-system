from pydantic import BaseModel
from typing import Optional
from datetime import time

class StaffScheduleCreate(BaseModel):
    employee_id: int
    shift_name: str
    assigned_day: str
    start_time: Optional[time] = None
    end_time: Optional[time] = None
    status: str = "Active"

class StaffScheduleUpdate(BaseModel):
    employee_id: int
    shift_name: str
    assigned_day: str
    start_time: Optional[time] = None
    end_time: Optional[time] = None
    status: str = "Active"
    