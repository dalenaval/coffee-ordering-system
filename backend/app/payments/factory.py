from .cash import CashPaymentStrategy
from .paymongo import PayMongoPaymentStrategy
from .qrph import QRPHPaymentStrategy

class PaymentFactory:

    @staticmethod
    def get(method:str):

        if method == "cash":
            return CashPaymentStrategy()
        
        if method == "qrph":
            return QRPHPaymentStrategy()
        
        if method == "paymongo":
            return PayMongoPaymentStrategy()
        
        raise Exception('Invalid payment method')
    
