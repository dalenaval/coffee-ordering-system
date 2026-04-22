import qrcode
import base64
import io

from app.payments.base import PaymentStrategy
from app.models.payment import Payment

class QRPHPaymentStrategy(PaymentStrategy):

    def create_payment(self, order, db):
        payload = f"QRPH|ORDER:{order.id}|AMOUNT:{order.total_amount}"

        qr = qrcode.make(payload)
        buffer = io.BytesIO()
        qr.save(buffer, format="PNG")

        qr_base64 = base64.b64encode(buffer.getvalue()).decode()

        payment = Payment(
            order_id = order.id,
            payment_method = "qrph",
            payment_status = "pending",
            reference_no=f"QRPH-{order.id}",
            total_amount = order.total_amount,
        )

        return {
            "type": "qrph",
            "qr_image": f"data:image/png;base64,{qr_base64}",
            "message": "Scan QR to pay"
        }
    
    def confirm_payment(self, payload, db):
        pass

