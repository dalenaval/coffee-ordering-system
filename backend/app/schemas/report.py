from pydantic import BaseModel

class ReportSummaryOut(BaseModel):
    total_orders: int
    total_sales: float
    completed_orders: int
    pending_orders: int
    cancelled_orders: int
    average_order_value: float
    