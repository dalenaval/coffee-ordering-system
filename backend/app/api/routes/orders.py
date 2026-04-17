from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.deps import get_db
from app.models.orders import Order
from app.models.customers import Customer
from app.models.product import Product
from app.models.order_item import OrderItem
from app.models.stock_log import StockLog

router = APIRouter(prefix="/orders", tags=["Orders"])

@router.get("/")
def get_orders(db: Session = Depends(get_db)):
    rows = (
        db.query(Order, Customer)
        .outerjoin(Customer, Order.customer_id == Customer.id)
        .order_by(Order.created_at.desc())
        .all()
    )

    return [
        {
            "id": order.id,
            "order_no": order.order_no,
            "customer_name": customer.full_name if customer else "Walk-in Customer",
            "order_type": order.order_type,
            "status": order.status,
            "subtotal": float(order.subtotal),
            "total_amount": float(order.total_amount),
            "created_at": order.created_at,
        }
        for order, customer in rows
    ]


@router.get("/{order_id}")
def get_order(order_id: int, db: Session = Depends(get_db)):
    order = db.query(Order).filter(Order.id == order_id).first()

    if not order:
        raise HTTPException(status_code=404, detail="Order not found.")

    return {
        "id": order.id,
        "order_no": order.order_no,
        "customer_id": order.customer_id,
        "order_type": order.order_type,
        "status": order.status,
        "subtotal": float(order.subtotal),
        "total_amount": float(order.total_amount),
        "created_at": order.created_at,
    }


@router.patch("/{order_id}/status")
def update_order_status(order_id: int, payload: dict, db: Session = Depends(get_db)):
    order = db.query(Order).filter(Order.id == order_id).first()

    if not order:
        raise HTTPException(status_code=404, detail="Order not found.")

    new_status = payload.get("status")
    if not new_status:
        raise HTTPException(status_code=400, detail="Status is required.")

    order.status = new_status
    db.commit()
    db.refresh(order)

    return {
        "message": "Order status updated successfully.",
        "order": {
            "id": order.id,
            "order_no": order.order_no,
            "status": order.status,
        }
    }
