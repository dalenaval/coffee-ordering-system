from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.deps import get_db
from app.models.employee import Employee

router = APIRouter(prefix="/employees", tags=["Employees"])

@router.get("/")
def get_employees(db: Session = Depends(get_db)):
    rows = db.query(Employee).order_by(Employee.full_name.asc()).all()

    return [
        {
            "id": row.id,
            "full_name": row.full_name,
            "position": row.position,
            "employment_status": row.employment_status,
            "is_active": row.is_active,
        }
        for row in rows
    ]
