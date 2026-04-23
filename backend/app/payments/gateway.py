from abc import ABC, abstractmethod

class PaymentGateway(ABC):

    @abstractmethod
    def create_payment_intent(self, amount: float) -> dict:
        pass

    @abstractmethod
    def confirm_payment_intent(self, payload: dict) -> dict:
        pass