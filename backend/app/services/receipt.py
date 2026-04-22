from datetime import datetime, timezone

def format_currency(value):
    return f"₱{value:,.2f}"


def generate_receipt(order, order_items, payment):
    items_html = ""

    for item in order_items:
        options_html = ""
        for opt in item.options:
            options_html += f"""
                <div style="margin-left:10px; font-size:12px;">
                    + {opt.option_name} ({format_currency(opt.option_price)})
                </div>
            """

        items_html += f"""
        <div style="margin-bottom:10px;">
            <div>
                {item.quantity} x {item.product.name}
                <span style="float:right;">
                    {format_currency(item.line_total)}
                </span>
            </div>
            {options_html}
        </div>
        """

    html = f"""
    <div style="font-family: monospace; max-width: 400px; margin:auto;">
        <h2 style="text-align:center;">☕ Kape NgaNi Shop</h2>
        <hr/>

        <p>
            <strong>Order ID:</strong> {order.order_id}<br/>
            <strong>Date:</strong> {datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S")}<br/>
            <strong>Payment:</strong> {payment.payment_method.upper()}<br/>
            <strong>Reference:</strong> {payment.reference_no or 'N/A'}
        </p>

        <hr/>

        {items_html}

        <hr/>

        <div>
            <span>Subtotal</span>
            <span style="float:right;">{format_currency(order.subtotal)}</span>
        </div>

        <div>
            <strong>Total</strong>
            <strong style="float:right;">
                {format_currency(order.total_amount)}
            </strong>
        </div>

        <hr/>

        <p style="text-align:center;">
            Thank you for your purchase! 
        </p>
    </div>
    """

    return html