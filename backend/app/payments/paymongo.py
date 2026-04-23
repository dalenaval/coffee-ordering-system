from app.payments.base import PaymentStrategy
from app.models.payment import Payment
from app.payments.gateway import PaymentGateway

class PayMongoPaymentStrategy(PaymentStrategy):

    def __init__(self, service:PaymentGateway):
        self.service = service
        
    def create_payment(self, order, payment_method: str, db):
        intent = self.service.create_payment_intent(float(order.total_amount))

        payment = Payment(
            order_id = order.id,
            payment_method = payment_method,
            payment_status = "pending",
            payment_intent_id = intent['data']['id'],
            total_amount = order.total_amount
        )

        db.add(payment)
        db.commit()

        return{
            "type":"paymongo",
            "client_key":intent['data']['attributes']['client_key'],
            "payment_intent_id": intent['data']['id']
        }
    
    def confirm_payment(self, payload, db):
        result = self.service.confirm_payment_intent(payload)

        payment = db.query(Payment).filter(
            Payment.payment_intent_id == payload.get("payment_intent_id")
        ).first()

        if payment:
            payment.payment_status = result.get("status", "paid")

        db.commit()    
        return result
    

