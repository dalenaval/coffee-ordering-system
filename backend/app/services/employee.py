from sqlalchemy.orm import Session
from app.models.employee import Employee

def get_employees(db: Session):
    return db.query(Employee).order_by(Employee.id.desc()).all()

def create_employee(db: Session, payload):
    employee = Employee(**payload.model_dump())
    db.add(employee)
    db.commit()
    db.refresh(employee)
    return employee

def get_employee_by_id(db: Session, employee_id: int):
    return db.query(Employee).filter(Employee.id == employee_id).first()

def get_employee_by_code(db: Session, employee_code: str):
    return db.query(Employee).filter(Employee.employee_code == employee_code).first()

def update_employee(db: Session, employee, payload):
    for key, value in payload.model_dump(exclude_unset=True).items():
        setattr(employee, key, value)

    db.commit()
    db.refresh(employee)
    return employee
