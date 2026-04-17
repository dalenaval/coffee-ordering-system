from sqlalchemy.orm import Session, joinedload
from app.models.staff_schedule import StaffSchedule

def get_schedules(db: Session, shift_date=None):
    query = db.query(StaffSchedule).options(joinedload(StaffSchedule.employee))

    if shift_date:
        query = query.filter(StaffSchedule.shift_date == shift_date)

    return query.order_by(StaffSchedule.shift_date.desc()).all()

def create_schedule(db: Session, payload):
    schedule = StaffSchedule(**payload.model_dump())
    db.add(schedule)
    db.commit()
    db.refresh(schedule)
    return schedule

