import os
import base64
import requests


class PaymentGateway:
    BASE_URL = "https://api.paymongo.com/v1"

    def __init__(self):
        self.secret_key = os.getenv("PAYMONGO_SECRET_KEY")
        if not self.secret_key:
            raise ValueError("PAYMONGO_SECRET_KEY is not configured.")

    def _headers(self):
        encoded = base64.b64encode(f"{self.secret_key}:".encode()).decode()
        return {
            "accept": "application/json",
            "content-type": "application/json",
            "authorization": f"Basic {encoded}",
        }

    def create_payment_intent(self, amount: float, payment_methods=None, description=None):
        if payment_methods is None:
            payment_methods = ["card"]

        response = requests.post(
            f"{self.BASE_URL}/payment_intents",
            headers=self._headers(),
            json={
                "data": {
                    "attributes": {
                        "amount": int(round(amount * 100)),
                        "payment_method_allowed": payment_methods,
                        "payment_method_options": {
                            "card": {
                                "request_three_d_secure": "automatic"
                            }
                        },
                        "currency": "PHP",
                        "capture_type": "automatic",
                        "description": description or "Coffee ordering payment",
                    }
                }
            },
            timeout=30,
        )
        response.raise_for_status()
        return response.json()

    def attach_payment_intent(self, payment_intent_id: str, payment_method_id: str, return_url: str):
        response = requests.post(
            f"{self.BASE_URL}/payment_intents/{payment_intent_id}/attach",
            headers=self._headers(),
            json={
                "data": {
                    "attributes": {
                        "payment_method": payment_method_id,
                        "return_url": return_url,
                    }
                }
            },
            timeout=30,
        )
        response.raise_for_status()
        return response.json()

    def retrieve_payment_intent(self, payment_intent_id: str):
        response = requests.get(
            f"{self.BASE_URL}/payment_intents/{payment_intent_id}",
            headers=self._headers(),
            timeout=30,
        )
        response.raise_for_status()
        return response.json()
    