from fastapi import APIRouter, Request, Depends, HTTPException, status, BackgroundTasks
from sqlalchemy.orm import Session, selectinload
from app.core.ws_manager import manager

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
from app.services.webhook import verify_signature

router = APIRouter(prefix="webhook", tags=['Webhook'])

@router.post("/paymongo")
async def webhook(request: Request, bg:BackgroundTasks, db:Session = Depends(get_db)):
    raw_body = await request.body()
    signature = request.headers.get("Paymongo-Signature")

    if not verify_signature(raw_body, signature):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="invalid webhook signature")
    
    data = json.loads(raw_body)

    event_type = data.get("data",{}).get("attributes",{}).get("type")

    if event_type != "payment.paid":
        return {"ignored":True, "reason": "unsupported event"}
    
    try:
        payment_intent_id = (
             data["data"]["attributes"]["data"]["attributes"]["payment_intent_id"]
        )

    except KeyError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid payload structure"
        )
    

    intent_id = data['data']['attributes']['data']['attributes']['payment_intent_id']

    payment = (
        db.query(Payment)
        .filter_by(payment_intent_id = intent_id)
        .first()
    )

    if not payment:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Payment not found")

    if payment.payment_status == 'paid':
        return {"status": "already processed"}
    
    payment.payment_status = "paid" 
    payment.reference_no = data["data"]["id"]
    payment.paid_at = datetime.now(timezone.utc)

    order = db.query(Order).filter(Order.id == payment.order_id).first()

    if not order:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order is not found")
    
    order.status = "paid"
    db.commit()
    bg.add_task(send_receipt(order, payment))
    
    return {"ok": True}


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

        elif data.type in ['gcash', 'maya']:
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
    

