from app.payments.base import PaymentStrategy
from app.models.payment import Payment
from app.payments.gateway import PaymentGateway


class PayMongoPaymentStrategy(PaymentStrategy):
    def __init__(self, service: PaymentGateway):
        self.service = service

    def create_payment(self, order, payment_method: str, db):
        intent = self.service.create_payment_intent(
            amount=float(order.total_amount),
            payment_methods=["card"],
            description=f"Order #{order.id}",
        )

        payment = Payment(
            order_id=order.id,
            payment_method=payment_method,
            payment_status="pending",
            payment_intent_id=intent["data"]["id"],
            total_amount=order.total_amount,
        )

        db.add(payment)
        db.commit()
        db.refresh(payment)

        return {
            "type": "paymongo",
            "payment_intent_id": intent["data"]["id"],
            "client_key": intent["data"]["attributes"]["client_key"],
            "status": intent["data"]["attributes"]["status"],
        }

    def confirm_payment(self, payment_intent_id: str, db):
        result = self.service.retrieve_payment_intent(payment_intent_id)

        payment = db.query(Payment).filter(
            Payment.payment_intent_id == payment_intent_id
        ).first()

        if payment:
            payment.payment_status = result["data"]["attributes"]["status"]
            db.commit()

        return result
    