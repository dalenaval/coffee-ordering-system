from abc import ABC, abstractmethod

class PaymentStrategy(ABC):
    
    @abstractmethod
    def create_payment(self, order, db):
        pass

    @abstractmethod
    def confirm_payment(self, payload,db):
        pass

