from app.payments.base import PaymentStrategy
from app.models.payment import Payment

class CashPaymentStrategy(PaymentStrategy):
    
    def create_payment(self, order, payment_method, db):
        payment = Payment(
            order_id = order.id,
            payment_method = payment_method,
            payment_status = "pending",
            total_amount = order.total_amount,
        )
        print(f"payment in cashStrategy:", payment)
        db.add(payment)
        db.commit()

        return {
            "type": "cash",
            "message": "Pay at the counter"
        }
    
    def confirm_payment(self, payload: dict, db):
        return {"status": "paid"}
    
