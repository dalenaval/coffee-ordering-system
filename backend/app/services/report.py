from sqlalchemy.orm import Session
from sqlalchemy import func
from app.models.orders import Order

def get_report_summary(db: Session, date_from=None, date_to=None):
    query = db.query(Order)

    if date_from:
        query = query.filter(func.date(Order.created_at) >= date_from)

    if date_to:
        query = query.filter(func.date(Order.created_at) <= date_to)

    total_orders = query.count()
    total_sales = query.with_entities(func.coalesce(func.sum(Order.total_amount), 0)).scalar() or 0

    completed_orders = query.filter(func.lower(Order.status) == "completed").count()
    pending_orders = query.filter(func.lower(Order.status) == "pending").count()
    cancelled_orders = query.filter(func.lower(Order.status) == "cancelled").count()

    average_order_value = float(total_sales / total_orders) if total_orders else 0

    return {
        "total_orders": total_orders,
        "total_sales": float(total_sales),
        "completed_orders": completed_orders,
        "pending_orders": pending_orders,
        "cancelled_orders": cancelled_orders,
        "average_order_value": round(average_order_value, 2),
    }
