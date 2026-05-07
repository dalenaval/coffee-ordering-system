from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.deps import get_db
from app.models.employee import Employee
from app.models.user import User
from app.schemas.employee import EmployeeCreate, EmployeeUpdate, EmployeeToggleStatus

from app.core.security import hash_password


router = APIRouter(prefix="/employees", tags=["Employees"])


@router.get("/")
def get_employees(db: Session = Depends(get_db)):
    rows = db.query(Employee).order_by(Employee.full_name.asc()).all()

    return [
        {
            "id": row.id,
            "full_name": row.full_name,
            "email": row.email,
            "contact_no": row.contact_no,
            "position": row.position,
            "role": row.role,
            "employment_status": row.employment_status,
            "is_active": row.is_active,
            "user_id": row.user_id,
            "login_email": row.user.email if row.user else None,
        }
        for row in rows
    ]


@router.post("/")
def create_employee(payload: EmployeeCreate, db: Session = Depends(get_db)):
    existing_employee_email = None
    if payload.email:
        existing_employee_email = db.query(Employee).filter(Employee.email == payload.email).first()

    if existing_employee_email:
        raise HTTPException(status_code=400, detail="Employee email already exists.")

    linked_user_id = None

    if payload.create_login_account:
        if not payload.login_email or not payload.login_password:
            raise HTTPException(
                status_code=400,
                detail="Login email and password are required when creating a login account."
            )

        existing_user = db.query(User).filter(User.email == payload.login_email).first()
        if existing_user:
            raise HTTPException(status_code=400, detail="Login email already exists in users.")

        new_user = User(
            full_name=payload.full_name,
            email=payload.login_email,
            password=hash_password(payload.login_password),
            role=payload.role,
            is_active=payload.is_active
        )
        db.add(new_user)
        db.flush()
        linked_user_id = new_user.id

    employee = Employee(
        full_name=payload.full_name,
        email=payload.email,
        contact_no=payload.contact_no,
        position=payload.position,
        role=payload.role,
        employment_status=payload.employment_status,
        is_active=payload.is_active,
        user_id=linked_user_id
    )

    db.add(employee)
    db.commit()
    db.refresh(employee)

    return {
        "message": "Employee created successfully.",
        "employee_id": employee.id,
        "user_id": linked_user_id
    }


@router.put("/{employee_id}")
def update_employee(employee_id: int, payload: EmployeeUpdate, db: Session = Depends(get_db)):
    employee = db.query(Employee).filter(Employee.id == employee_id).first()
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found.")

    if payload.email:
        existing_email = (
            db.query(Employee)
            .filter(Employee.email == payload.email, Employee.id != employee_id)
            .first()
        )
        if existing_email:
            raise HTTPException(status_code=400, detail="Employee email already exists.")

    employee.full_name = payload.full_name
    employee.email = payload.email
    employee.contact_no = payload.contact_no
    employee.position = payload.position
    employee.role = payload.role
    employee.employment_status = payload.employment_status
    employee.is_active = payload.is_active

    if employee.user:
        employee.user.full_name = payload.full_name
        employee.user.role = payload.role
        employee.user.is_active = payload.is_active

    db.commit()
    db.refresh(employee)

    return {"message": "Employee updated successfully."}


@router.patch("/{employee_id}/status")
def toggle_employee_status(employee_id: int, payload: EmployeeToggleStatus, db: Session = Depends(get_db)):
    employee = db.query(Employee).filter(Employee.id == employee_id).first()
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found.")

    employee.is_active = payload.is_active
    employee.employment_status = "Active" if payload.is_active else "Inactive"

    if employee.user:
        employee.user.is_active = payload.is_active

    db.commit()
    db.refresh(employee)

    return {"message": "Employee status updated successfully."}


@router.get("/{employee_id}")
def get_employee(employee_id: int, db: Session = Depends(get_db)):
    employee = db.query(Employee).filter(Employee.id == employee_id).first()
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found.")

    return {
        "id": employee.id,
        "full_name": employee.full_name,
        "email": employee.email,
        "contact_no": employee.contact_no,
        "position": employee.position,
        "role": employee.role,
        "employment_status": employee.employment_status,
        "is_active": employee.is_active,
        "user_id": employee.user_id,
        "login_email": employee.user.email if employee.user else None,
    }
