from app.payments.cash import CashPaymentStrategy
from app.payments.paymongo import PayMongoPaymentStrategy
from app.payments.qrph import QRPHPaymentStrategy
from app.payments.base import PaymentStrategy
from app.services.paymongo_service import PayMongoService

class PaymentFactory:

    @staticmethod
    def get(method: str):

        if method.lower() in ["gcash", "paymaya", "card"]:
            return PayMongoPaymentStrategy(PayMongoService())

        elif method.lower() == "cash":
            return CashPaymentStrategy()

        elif method.lower() == "qrph":
            return QRPHPaymentStrategy()

        raise ValueError("Invalid payment method")
    

