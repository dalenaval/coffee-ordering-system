from abc import ABC, abstractmethod

class PaymentStrategy(ABC):
    
    @abstractmethod
    def create_payment(self, order:dict, payment_method: str, db):
        pass

    @abstractmethod
    def confirm_payment(self, payload: dict, db):
        pass

