from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.deps import get_db
from app.models.order_item import OrderItem
from app.models.product import Product

router = APIRouter(prefix="/order-items", tags=["Order Items"])


@router.get("/")
def get_order_items(db: Session = Depends(get_db)):
    rows = (
        db.query(OrderItem, Product)
        .join(Product, OrderItem.product_id == Product.id)
        .order_by(OrderItem.id.desc())
        .all()
    )

    result = []
    for order_item, product in rows:
        result.append({
            "id": order_item.id,
            "order_id": order_item.order_id,
            "product_id": order_item.product_id,
            "product_name": product.name if product else None,
            "quantity": order_item.quantity,
            "unit_price": float(order_item.unit_price),
            "line_total": float(order_item.line_total),
        })

    return result
