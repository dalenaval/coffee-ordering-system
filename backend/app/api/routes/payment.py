from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.deps import get_db
from app.models.payment import Payment
from app.models.orders import Order

router = APIRouter(prefix="/payments", tags=["Payments"])


@router.get("/")
def get_payments(db: Session = Depends(get_db)):
    rows = (
        db.query(Payment, Order)
        .join(Order, Payment.order_id == Order.id)
        .order_by(Payment.id.desc())
        .all()
    )

    result = []
    for payment, order in rows:
        result.append({
            "id": payment.id,
            "order_id": payment.order_id,
            "order_no": order.order_no if order else None,
            "payment_method": payment.payment_method,
            "payment_status": payment.payment_status,
            "amount": float(payment.amount),
            "reference_no": payment.reference_no,
            "paid_at": payment.paid_at,
            "created_at": payment.created_at,
        })

    return result