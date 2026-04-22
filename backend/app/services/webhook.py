import hmac
import hashlib
import os

WEBHOOK_SECRET = os.getenv("PAYMONGO_WEBHOOK_SECRET")


def verify_signature(payload: bytes, signature_header: str):

    try:
        parts = signature_header.split(",")
        timestamp = parts[0].split("=")[1]
        signature = parts[1].split("=")[1]

        signed_payload = f"{timestamp}.{payload.decode()}"

        computed_signature = hmac.new(
            WEBHOOK_SECRET.encode(),
            signed_payload.encode(),
            hashlib.sha256
        ).hexdigest()

        return hmac.compare_digest(computed_signature, signature)

    except:
        return False