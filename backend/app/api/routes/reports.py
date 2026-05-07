from zoneinfo import ZoneInfo

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime
from app.db.deps import get_db
from app.models.orders import Order
from app.models.order_item import OrderItem
from app.models.product import Product

router = APIRouter(prefix="/reports", tags=["Reports"])

@router.get("/summary")
def get_reports_summary(
    date_from: str | None = Query(None),
    date_to: str | None = Query(None),
    db: Session = Depends(get_db)
):
    manila_tz = ZoneInfo("Asia/Manila")
    order_query = db.query(Order)
    item_query = db.query(OrderItem, Product).join(Product, Product.id == OrderItem.product_id)

    if date_from:
        dt_from = datetime.strptime(date_from, "%Y-%m-%d").replace(tzinfo=manila_tz)
        order_query = order_query.filter(Order.created_at >= dt_from)

    if date_to:
        dt_to = datetime.strptime(date_to, "%Y-%m-%d").replace(
            hour=23, minute=59, second=59, microsecond=999999, tzinfo=manila_tz
        )
        order_query = order_query.filter(Order.created_at <= dt_to)
    filtered_orders = order_query.all()
    order_ids = [o.id for o in filtered_orders]

    total_sales = sum(float(o.total_amount or 0) for o in filtered_orders)
    total_orders = len(filtered_orders)

    best_products_map = {}

    if order_ids:
        items = (
            db.query(OrderItem, Product)
            .join(Product, Product.id == OrderItem.product_id)
            .filter(OrderItem.order_id.in_(order_ids))
            .all()
        )

        for item, product in items:
            if product.name not in best_products_map:
                best_products_map[product.name] = 0
            best_products_map[product.name] += int(item.quantity or 0)

    best_products = sorted(
        [{"name": k, "total_sold": v} for k, v in best_products_map.items()],
        key=lambda x: x["total_sold"],
        reverse=True
    )[:5]

    least_products = sorted(
        [{"name": k, "total_sold": v} for k, v in best_products_map.items()],
        key=lambda x: x["total_sold"] 
    )[:5]

    daily_map = {}
    for order in filtered_orders:
        key = order.created_at.strftime("%Y-%m-%d") if order.created_at else "Unknown"
        if key not in daily_map:
            daily_map[key] = {"date": key, "sales": 0, "orders": 0}
        daily_map[key]["sales"] += float(order.total_amount or 0)
        daily_map[key]["orders"] += 1

    daily_orders = list(daily_map.values())
    daily_orders.sort(key=lambda x: x["date"])

    return {
        "total_sales": total_sales,
        "total_orders": total_orders,
        "best_products": best_products,
        "least_products": least_products,
        "daily_orders": daily_orders
    }
