from app.services.paymongo_service import PayMongoService
from app.payments.base import PaymentStrategy
from app.payments.mapping import PaymentMapper
from app.models.payment import Payment

class PayMongoPaymentStrategy(PaymentStrategy):
    def create_payment(self, order, db):

        intent = PayMongoService.create_payment_intent(order.total_amount)

        payment = Payment(
            order_id = order.id,
            payment_method = order.payment_method,
            payment_status = "pending",
            payment_intent_id = intent['data']['id'],
            total_amount = order.total_amount
        )

        db.add(payment)
        db.commit()

        return{
            "type":"paymongo",
            "client_key":intent['data']['attribute']['client_key'],
            "payment_intent_id": intent['data']['id']
        }
    
    def confirm_payment(self, payload, db):
        pass

