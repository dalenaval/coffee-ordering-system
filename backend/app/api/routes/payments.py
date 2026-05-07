import os
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, selectinload

from datetime import datetime, timezone
from app.db.deps import get_db
from app.models.orders import Order
from app.models.payment import Payment
from app.payments.gateway import PaymentGateway
from app.models.order_item import OrderItem
from app.services.paymongo_service import PayMongoService
from app.services.receipt_email import send_receipt_email
from app.services.stock_service import deduct_stock_after_payment

router = APIRouter(prefix="/payments", tags=["Payments"])

gateway = PaymentGateway()


@router.post("/create-intent/{order_id}")
def create_payment_intent(order_id: int, db: Session = Depends(get_db)):
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found.")

    existing_payment = db.query(Payment).filter(Payment.order_id == order.id).first()
    if existing_payment and existing_payment.payment_status == "succeeded":
        return {
            "message": "Payment already completed.",
            "payment_intent_id": existing_payment.payment_intent_id,
            "status": existing_payment.payment_status,
        }

    intent = gateway.create_payment_intent(
        amount=float(order.total_amount),
        payment_methods=["card"],
        description=f"Order #{order.id}",
    )

    payment = existing_payment
    if not payment:
        payment = Payment(
            order_id=order.id,
            payment_method="card",
            payment_status=intent["data"]["attributes"]["status"],
            payment_intent_id=intent["data"]["id"],
            total_amount=order.total_amount,
        )
        db.add(payment)
    else:
        payment.payment_intent_id = intent["data"]["id"]
        payment.payment_status = intent["data"]["attributes"]["status"]
        payment.payment_method = "card"

    db.commit()
    db.refresh(payment)

    return {
        "payment_intent_id": intent["data"]["id"],
        "client_key": intent["data"]["attributes"]["client_key"],
        "status": intent["data"]["attributes"]["status"],
    }


@router.post("/attach")
def attach_payment(payload: dict, db: Session = Depends(get_db)):
    payment_intent_id = payload.get("payment_intent_id")
    payment_method_id = payload.get("payment_method_id")

    if not payment_intent_id or not payment_method_id:
        raise HTTPException(status_code=400, detail="payment_intent_id and payment_method_id are required.")

    return_url = os.getenv("PAYMENT_RETURN_URL")
    if not return_url:
        raise HTTPException(status_code=500, detail="PAYMENT_RETURN_URL is not configured.")

    result = gateway.attach_payment_intent(
        payment_intent_id=payment_intent_id,
        payment_method_id=payment_method_id,
        return_url=return_url,
    )

    payment = db.query(Payment).filter(
        Payment.payment_intent_id == payment_intent_id
    ).first()

    if payment:
        payment.payment_status = result["data"]["attributes"]["status"]
        db.commit()

    attributes = result["data"]["attributes"]
    next_action = attributes.get("next_action") or {}

    return {
        "payment_intent_id": result["data"]["id"],
        "status": attributes.get("status"),
        "next_action": next_action,
    }

@router.post("/verify")
def verify_payment(payload: dict, db: Session = Depends(get_db)):
    payment_intent_id = payload.get("payment_intent_id")

    if not payment_intent_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="payment_intent_id is required"
        )

    payment = db.query(Payment).filter(
        Payment.payment_intent_id == payment_intent_id
    ).first()

    if not payment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Payment not found"
        )

    order = db.query(Order).filter(Order.id == payment.order_id).first()

    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Order not found"
        )

    try:
        service = PayMongoService()
        paymongo_result = service.retrieve_payment_intent(payment_intent_id)

        paymongo_status = paymongo_result["data"]["attributes"]["status"]
        payment_paid_at = paymongo_result["data"]["attributes"]['payments'][0]['attributes']["paid_at"]

        if paymongo_status in ["succeeded", "paid"]:
            if payment.payment_status != "paid":
                deduct_stock_after_payment(order, db)
        
            if payment_paid_at:
                payment.paid_at = datetime.fromtimestamp(payment_paid_at, tz=timezone.utc)
                
            payment.payment_status = "paid"
            order.status = "paid"
        
            db.commit()
            db.refresh(payment)
            db.refresh(order)
        
            try:
                send_receipt_email(order, db)
            except Exception as email_error:
                print("Receipt email failed:", str(email_error))
        
            return {
                "message": "Payment verified successfully",
                "status": "paid",
                "order_id": order.id,
                "order_no": order.order_no,
            }

        elif paymongo_status in ["processing", "awaiting_next_action", "awaiting_payment_method"]:
            return {
                "message": "Payment not yet completed",
                "status": paymongo_status,
                "order_id": order.id,
                "order_no": order.order_no,
            }

        else:
            payment.payment_status = "failed"
            order.status = "failed"
            db.commit()

            return {
                "message": "Payment failed",
                "status": "failed",
                "order_id": order.id,
                "order_no": order.order_no,
            }

    except Exception as e:
        print("VERIFY PAYMENT ERROR:", str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )
    