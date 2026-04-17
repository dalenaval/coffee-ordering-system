from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.deps import get_db
from app.models.staff_schedule import StaffSchedule
from app.models.employee import Employee
from app.schemas.staff_schedule import StaffScheduleCreate, StaffScheduleUpdate
from datetime import time

router = APIRouter(prefix="/staff-scheduling", tags=["Staff Scheduling"])

@router.get("/")
def get_staff_schedules(db: Session = Depends(get_db)):
    rows = (
        db.query(StaffSchedule, Employee)
        .join(Employee, StaffSchedule.employee_id == Employee.id)
        .order_by(StaffSchedule.assigned_day.asc(), StaffSchedule.shift_name.asc())
        .all()
    )

    return [
        {
            "id": sched.id,
            "employee_id": sched.employee_id,
            "employee_name": emp.full_name,
            "position": emp.position,
            "shift_name": sched.shift_name,
            "assigned_day": sched.assigned_day,
            "start_time": sched.start_time.strftime("%H:%M") if sched.start_time else None,
            "end_time": sched.end_time.strftime("%H:%M") if sched.end_time else None,
            "status": sched.status,
        }
        for sched, emp in rows
    ]


@router.post("/")
def create_staff_schedule(payload: StaffScheduleCreate, db: Session = Depends(get_db)):

    existing = db.query(StaffSchedule).filter(
        StaffSchedule.employee_id == payload.employee_id,
        StaffSchedule.assigned_day == payload.assigned_day
    ).all()

    for sched in existing:
        if sched.start_time and sched.end_time and payload.start_time and payload.end_time:
            if is_time_overlap(
                payload.start_time, payload.end_time,
                sched.start_time, sched.end_time
            ):
                raise HTTPException(
                    status_code=400,
                    detail="Schedule conflict: overlapping time for this employee."
                )

    schedule = StaffSchedule(**payload.dict())

    db.add(schedule)
    db.commit()
    db.refresh(schedule)

    return {"message": "Schedule assigned successfully"}


@router.put("/{schedule_id}")
def update_staff_schedule(schedule_id: int, payload: StaffScheduleUpdate, db: Session = Depends(get_db)):

    schedule = db.query(StaffSchedule).filter(StaffSchedule.id == schedule_id).first()
    if not schedule:
        raise HTTPException(status_code=404, detail="Schedule not found.")

    existing = db.query(StaffSchedule).filter(
        StaffSchedule.employee_id == payload.employee_id,
        StaffSchedule.assigned_day == payload.assigned_day,
        StaffSchedule.id != schedule_id
    ).all()

    for sched in existing:
        if sched.start_time and sched.end_time:
            if is_time_overlap(
                payload.start_time, payload.end_time,
                sched.start_time, sched.end_time
            ):
                raise HTTPException(
                    status_code=400,
                    detail="Schedule conflict detected."
                )

    for key, value in payload.dict().items():
        setattr(schedule, key, value)

    db.commit()
    db.refresh(schedule)

    return {"message": "Updated successfully"}


@router.delete("/{schedule_id}")
def delete_staff_schedule(schedule_id: int, db: Session = Depends(get_db)):
    schedule = db.query(StaffSchedule).filter(StaffSchedule.id == schedule_id).first()
    if not schedule:
        raise HTTPException(status_code=404, detail="Schedule not found.")

    db.delete(schedule)
    db.commit()

    return {"message": "Schedule deleted successfully."}

def is_time_overlap(start1, end1, start2, end2):
    return start1 < end2 and start2 < end1

