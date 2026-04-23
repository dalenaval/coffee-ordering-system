from app.payments.factory import PaymentFactory

class PaymentService:

    @staticmethod
    def create_payment(order, payment_method, db):

        strategy = PaymentFactory.get(payment_method)

        result = strategy.create_payment(order, payment_method,db)

        return result
    
