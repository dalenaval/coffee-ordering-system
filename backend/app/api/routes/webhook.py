from fastapi import APIRouter, Request, Depends, HTTPException, status, BackgroundTasks
from sqlalchemy.orm import Session

import resend
import json

from typing import Dict
from datetime import datetime, timezone

from app.db.deps import get_db
from app.models.payment import Payment
from app.models.order_item import OrderItem
from app.models.orders import Order

from app.services.receipt import generate_receipt
from app.services.paymongo_service import PayMongoService
from app.services.webhook import verify_signature, process_webhook_event

router = APIRouter(prefix="webhook", tags=['Webhook'])

@router.post("/paymongo")
async def webhook(request: Request, bg:BackgroundTasks):
    raw_body = await request.body()
    signature = request.headers.get("Paymongo-Signature")

    if not verify_signature(raw_body, signature):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, 
            detail="invalid webhook signature")
    
    data = json.loads(raw_body)

    bg.add_task(process_webhook_event, data)
    
    return {"status": "received"}


@router.post('/attach-payment')
def attach_payment(data:dict):

    response = PayMongoService.attach_payment_intent(
        data.intent_id,
        data.payment_method_id
    )

    return response

@router.post("/create-payment-method")
def create_payment_method(data:dict):
    try:
        if data.type == "card":
            details = {
                "details":{
                    "card_number": data.card_number,
                    "exp_month": data.exp_month,
                    "exp_year": data.exp_year,
                    "cvc": data.cvc
                },
                "billing": {
                    "name": data.name,
                    "email": data.email
                }
            }

        elif data.type in ['gcash', 'paymaya']:
            details = {
                'billings':{
                    'name': data.name or "Guest User",
                    "email": data.email or "guest@example.com"
                    }
            }
        
        response = PayMongoService.create_payment_method(data.type, details)
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))


def send_receipt(order:dict, payment: dict)->Dict:
    try:
        receipt_html = generate_receipt(
            order, 
            order.items, 
            payment
        )

        resend.Emails.send({
            "from": "onboarding@resend.dev",
            "to":[order.get("email")],
            "subject":f"Kape NgaNI Purchase Receipt",
            "html": receipt_html
        })
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e)) 
    

