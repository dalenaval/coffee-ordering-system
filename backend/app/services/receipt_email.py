import resend
from app.core.config import RESEND_API_KEY
from app.models.order_item import OrderItem

resend.api_key = RESEND_API_KEY


def send_receipt_email(order, db):
    customer_email = order.email
    if not customer_email:
        return None

    items = db.query(OrderItem).filter(OrderItem.order_id == order.id).all()

    items_html = ""
    for item in items:
        items_html += f"""
        <tr>
            <td style="padding:8px;border-bottom:1px solid #eee;">
                {item.quantity}x Product #{item.product_id}
            </td>
            <td style="padding:8px;border-bottom:1px solid #eee;text-align:right;">
                ₱ {float(item.line_total):.2f}
            </td>
        </tr>
        """

    html = f"""
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:24px;">
        <h2 style="color:#4b2e1e;">Kape Nga Ni</h2>
        <p>Thank you for your payment.</p>

        <h3>Digital Receipt</h3>
        <p><strong>Order No:</strong> {order.order_no}</p>
        <p><strong>Order Type:</strong> {order.order_type}</p>
        <p><strong>Status:</strong> {order.status}</p>

        <table style="width:100%;border-collapse:collapse;margin-top:16px;">
            <thead>
                <tr>
                    <th style="text-align:left;padding:8px;border-bottom:2px solid #ddd;">Item</th>
                    <th style="text-align:right;padding:8px;border-bottom:2px solid #ddd;">Amount</th>
                </tr>
            </thead>
            <tbody>
                {items_html}
            </tbody>
        </table>

        <div style="margin-top:20px;">
            <p><strong>Total Amount:</strong> ₱ {float(order.total_amount):.2f}</p>
        </div>

        <p style="margin-top:24px;color:#666;">
            This is your digital receipt from Kape Nga Ni.
        </p>
    </div>
    """

    return resend.Emails.send({
        "from": "Kape Nga Ni <admin@kapengani.dev>",
        "to": [customer_email],
        "subject": f"Your Kape Nga Ni Receipt - {order.order_no}",
        "html": html,
    })
