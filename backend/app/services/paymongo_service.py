import requests
import base64

from app.core.config import PAYMONGO_SECRET_KEY,PAYMONGO_BASE_URL

def get_auth_header():
    key = f"{PAYMONGO_SECRET_KEY}:"
    encoded = base64.b64encode(key.encode()).decode()
    return{
        "Authorization" : f"Basic {encoded}",
        "Content-type" : "application/json",
    }

class PayMongoService:

    BASE_URL = PAYMONGO_BASE_URL

    @staticmethod
    def create_payment_intent(amount, payment_method_types = ["gcash", "paymaya", "card"]):
        url = f"{PayMongoService.BASE_URL}/payment_intents"

        payload = {
            "data":{
                "attributes":{
                    "amount":int(amount * 100), # in cents value
                    "payment_method_allowed":payment_method_types,
                    "currency": "PHP"
                }
            }
        }

        response = requests.post(url, json=payload, headers=get_auth_header())
        return response.json()
    
    @staticmethod
    def create_payment_method(type, details):
        url = f"{PayMongoService.BASE_URL}/payments_methods"

        payload = {
            "data":{
                "attributes":{
                    "type": type,
                    **details
                }
            }
        }

        response = requests.post(url, json=payload, headers=get_auth_header())
        return response.json()
    
    @staticmethod
    def attach_payment_intent(intent_id, payment_method_id):
        url = f"{PayMongoService.BASE_URL}/payment_intents.{intent_id}/attach"

        payload = {
            "data":{
                "attributes":{
                    "payment_method": payment_method_id,
                    "return_url": "http://localhost:5173/payment-success"

                }
            }
        }

        response =requests.post(url, json=payload, headers=get_auth_header())
        return response.json()
    
