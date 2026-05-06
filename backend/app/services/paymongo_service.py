import base64
import requests

from app.payments.gateway import PaymentGateway
from app.core.config import PAYMONGO_SECRET_KEY, PAYMONGO_BASE_URL, FRONTEND_URL


def get_auth_header():
    key = f"{PAYMONGO_SECRET_KEY}:"
    encoded = base64.b64encode(key.encode()).decode()

    return {
        "Authorization": f"Basic {encoded}",
        "Content-Type": "application/json",
        "Accept": "application/json",
    }


class PayMongoService(PaymentGateway):
    BASE_URL = PAYMONGO_BASE_URL

    def create_payment_intent(self, amount: float) -> dict:
        url = f"{self.BASE_URL}/payment_intents"

        payload = {
            "data": {
                "attributes": {
                    "amount": int(round(float(amount) * 100)),
                    "payment_method_allowed": ["gcash", "paymaya", "card"],
                    "currency": "PHP",
                }
            }
        }

        response = requests.post(url, json=payload, headers=get_auth_header(), timeout=30)

        if response.status_code not in [200, 201]:
            raise Exception(f"PayMongo Create Intent Error: {response.text}")

        return response.json()

    def retrieve_payment_intent(self, intent_id: str) -> dict:
        url = f"{self.BASE_URL}/payment_intents/{intent_id}"

        response = requests.get(url, headers=get_auth_header(), timeout=30)

        if response.status_code != 200:
            raise Exception(f"PayMongo Retrieve Intent Error: {response.text}")

        return response.json()

    def get_first_payment_id_from_intent(self, intent_id: str) -> str:
        intent = self.retrieve_payment_intent(intent_id)

        payments = intent.get("data", {}).get("attributes", {}).get("payments", [])

        if not payments:
            raise Exception("No completed payment found in PayMongo payment intent.")

        return payments[0]["id"]

    def confirm_payment_intent(self, payload: dict) -> dict:
        try:
            event_type = payload["data"]["attributes"]["type"]

            if event_type != "payment.paid":
                return {"status": "ignored"}

            payment_intent_id = payload["data"]["attributes"]["data"]["attributes"]["payment_intent_id"]

            return {
                "status": "paid",
                "payment_intent_id": payment_intent_id,
            }

        except KeyError:
            raise ValueError("Invalid webhook payload")

    @staticmethod
    def create_payment_method(type: str, details: dict) -> dict:
        url = f"{PayMongoService.BASE_URL}/payment_methods"

        payload = {
            "data": {
                "attributes": {
                    "type": type,
                    **details,
                }
            }
        }

        response = requests.post(url, json=payload, headers=get_auth_header(), timeout=30)

        if response.status_code not in [200, 201]:
            raise Exception(f"PayMongo Create Payment Method Error: {response.text}")

        return response.json()

    def attach_payment_intent(
        self,
        intent_id: str,
        payment_method_id: str,
        return_url: str = None,
    ) -> dict:
        url = f"{self.BASE_URL}/payment_intents/{intent_id}/attach"

        callback_url = return_url or f"{FRONTEND_URL}/payment/callback?payment_intent_id={intent_id}"

        payload = {
            "data": {
                "attributes": {
                    "payment_method": payment_method_id,
                    "return_url": callback_url,
                }
            }
        }

        response = requests.post(url, json=payload, headers=get_auth_header(), timeout=30)

        if response.status_code not in [200, 201]:
            raise Exception(f"PayMongo Attach Error: {response.text}")

        return response.json()

    def create_refund(
        self,
        payment_id: str,
        amount: float,
        reason: str = "requested_by_customer",
    ) -> dict:
        url = f"{self.BASE_URL}/refunds"

        payload = {
            "data": {
                "attributes": {
                    "payment_id": payment_id,
                    "amount": int(round(float(amount) * 100)),
                    "reason": reason,
                }
            }
        }

        response = requests.post(url, json=payload, headers=get_auth_header(), timeout=30)

        if response.status_code not in [200, 201]:
            raise Exception(f"PayMongo Refund Error: {response.text}")

        return response.json()
        