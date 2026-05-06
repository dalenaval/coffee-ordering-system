from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models.product import Product
from app.models.order_item import OrderItem


def deduct_stock_after_payment(order, db: Session):
    order_items = db.query(OrderItem).filter(OrderItem.order_id == order.id).all()

    if not order_items:
        raise HTTPException(status_code=400, detail="No order items found for stock deduction.")

    for item in order_items:
        product = db.query(Product).filter(Product.id == item.product_id).first()

        if not product:
            raise HTTPException(
                status_code=404,
                detail=f"Product ID {item.product_id} not found."
            )

        quantity_ordered = int(item.quantity or 0)
        current_stock = int(product.stock or 0)

        if current_stock < quantity_ordered:
            raise HTTPException(
                status_code=400,
                detail=f"Insufficient stock for {product.name}. Available: {current_stock}"
            )

        product.stock = current_stock - quantity_ordered

    return True

def restore_stock_after_cancellation(order, db: Session):
    order_items = db.query(OrderItem).filter(OrderItem.order_id == order.id).all()

    if not order_items:
        raise HTTPException(status_code=400, detail="No order items found for stock restore.")

    for item in order_items:
        product = db.query(Product).filter(Product.id == item.product_id).first()

        if not product:
            raise HTTPException(
                status_code=404,
                detail=f"Product ID {item.product_id} not found."
            )

        quantity_ordered = int(item.quantity or 0)
        current_stock = int(product.stock or 0)

        product.stock = current_stock + quantity_ordered

    return True
