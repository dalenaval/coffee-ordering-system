from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.db.deps import get_db
from app.models.orders import Order
from app.models.product import Product
from app.models.user import User
from app.models.payment import Payment

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])

@router.get("/summary")
def get_dashboard_summary(db: Session = Depends(get_db)):
    total_orders = db.query(func.count(Order.id)).scalar() or 0
    total_products = db.query(func.count(Product.id)).scalar() or 0
    total_customers = db.query(func.count(User.id)).scalar() or 0

    total_sales = (
        db.query(func.coalesce(func.sum(Payment.total_amount), 0))
        .filter(Payment.payment_status.in_(["paid", "completed"]))
        .scalar()
    ) or 0

    recent_orders = (
        db.query(Order)
        .order_by(Order.created_at.desc())
        .limit(5)
        .all()
    )

    return {
        "total_orders": total_orders,
        "total_products": total_products,
        "total_customers": total_customers,
        "total_sales": float(total_sales),
        "recent_orders": [
            {
                "id": order.id,
                "order_no": order.order_no,
                "order_type": order.order_type,
                "status": order.status,
                "total_amount": float(order.total_amount),
                "created_at": order.created_at,
            }
            for order in recent_orders
        ]
    }
