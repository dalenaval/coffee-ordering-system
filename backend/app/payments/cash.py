from app.payments.base import PaymentStrategy
from app.models.payment import Payment

class CashPaymentStrategy(PaymentStrategy):
    
    def create_payment(self, order, db):
        payment = Payment(
            order_id = order.id,
            payment_method = "cash",
            payment_status = "pending",
            total_amount = order.total_amount,
        )
        db.add(payment)
        db.commit()

        return {
            "type": "cash",
            "message": "Pay on pickup/delivery"
        }
    
    def confirm_payment(self, payload, db):
        pass
