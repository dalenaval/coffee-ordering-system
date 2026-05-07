import hmac
import hashlib
import os
import resend

from sqlalchemy.orm import Session
from fastapi import Depends, BackgroundTasks, HTTPException, status
from typing import Dict

from app.db.deps import get_db
from app.models.payment import Payment
from app.websocket.manager import manager
from app.models.orders import Order
from app.services.receipt import generate_receipt

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
    
def process_webhook_event(payload:dict, bg:BackgroundTasks, db: Session = Depends(get_db)):
    try:
        event_type = payload['data']['attributes']['type']

        if event_type == "payment.paid":
            payment_intent_id = payload['data']['attributes']['data']['attributes']['payment_intent_id']

            payment = db.query(Payment).filter(
                Payment.payment_intent_id == payment_intent_id
                ).first()

        if payment:
            payment.payment_status = "paid"
            payment.reference_no = payload['data']['id']
            print(payload)
            

            order = db.query(Order).filter(
                Order.id == payment.order_id
                ).first()
            
            if order:
                order.status = "processsing"
            
            bg.add_task(send_receipt(order, payment))
            db.commit()

            import asyncio
            async def notify():
                await manager.send_payment_update(
                    order_id = payment.order_id,
                    data = {
                        "status": "paid",
                        "order_id" : payment.order_id,
                        "message": "Payment Successful"
                    }
                )
            
            loop = asyncio.new_event_loop()
            asyncio.set_event_loop(loop)
            loop.run_until_complete(notify())
        
        elif event_type == "payment.failed":
            pass

    except Exception as e:
        print(f"Webhook processing error: {e}")
        db.rollback()

    finally: 
        db.close()


def send_receipt(order:dict, payment: dict)->Dict:
    try:
        receipt_html = generate_receipt(
            order, 
            order.items, 
            payment
        )

        resend.Emails.send({
            "from": "Kape Nga Ni <hello@kapengani.site>",
            "to":[order.get("email")],
            "subject":f"Kape NgaNI Purchase Receipt",
            "html": receipt_html
        })
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e)) 