from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, selectinload
from app.models.orders import Order
from app.models.user import User
from app.models.customers import Customer
from app.models.cart import Cart
from app.models.cart_item import CartItem
from app.models.order_item import OrderItem
from app.models.order_item_option import OrderItemOption
from app.models.payment import Payment
from app.models.stock_log import StockLog
from app.services.paymongo_service import PayMongoService
from app.core.config import PAYMONGO_SECRET_KEY,PAYMONGO_BASE_URL, FRONTEND_URL

import resend
import base64
import httpx

from typing import Dict, Optional

from app.db.deps import get_db
from app.services.auth import get_current_user
from app.services.cart import flatten_list
from app.payments.service import PaymentService

from app.core.config import RESEND_API_KEY
from app.core.config import SECRET_KEY, GENERATE_QR_URL
from app.utils.system_settings import get_system_settings_map

router = APIRouter(prefix="/orders", tags=["Orders"])

resend.api_key = RESEND_API_KEY

@router.get("/")
def get_orders(db: Session = Depends(get_db)):
    rows = (
        db.query(Order, User)
        .outerjoin(User, Order.user_id == User.id)
        .order_by(Order.created_at.desc())
        .all()
    )

    return [
        {
            "id": order.id,
            "order_no": order.order_no,
            "customer_name": (
                user.full_name if user
                else (order.email if order.email else "Walk-in Customer")
            ),
            "order_type": order.order_type,
            "status": order.status,
            "subtotal": float(order.subtotal or 0),
            "total_amount": float(order.total_amount or 0),
            "created_at": order.created_at,
        }
        for order, user in rows
    ]

@router.get("/{order_id}")
def get_order(order_id: int, db: Session = Depends(get_db)):
    order = db.query(Order).filter(Order.id == order_id).first()

    if not order:
        raise HTTPException(status_code=404, detail="Order not found.")

    return {
        "id": order.id,
        "order_no": order.order_no,
        "customer_id": order.user_id,
        "order_type": order.order_type,
        "status": order.status,
        "subtotal": float(order.subtotal),
        "total_amount": float(order.total_amount),
        "created_at": order.created_at,
    }


@router.post("/checkout")
async def create_order(
    payload:dict, 
    user_id = Depends(get_current_user), 
    db : Session = Depends(get_db)):

    if user_id:
            cart = db.query(Cart).filter_by(user_id = user_id).first()
            print(f"cart id :",  cart.id)

    try:

        last_order = db.query(Order).order_by(Order.id.desc()).first()

        next_sequence = 1

        if last_order and last_order.order_no:
            last_number = int(last_order.order_no[3:])

            next_sequence = last_number + 1

        new_order_id = f"ORD{next_sequence:03d}"
        order_items = payload.get('cart_items', [])

        order = Order(
            order_no = new_order_id,
            user_id = user_id,
            email = payload.get("email") if payload.get("email") != "" else None,
            phone = payload.get("phone") if payload.get("phone") != "" else None,
            order_type = payload.get("order_type"),
            status = "pending",
            subtotal = payload.get("subtotal"),
            total_amount = float(payload.get("total_amount"))
        )
        db.add(order)
        db.flush()
        for order_item in order_items:
            new_order_item = OrderItem(
                order_id = order.id,
                product_id = order_item.get('product_id'),
                quantity = order_item.get("quantity"),
                unit_price = order_item.get("unit_price"),
                option_total = order_item.get("option_total"),
                line_total = order_item.get("line_total")
            )

            db.add(new_order_item)
            db.flush()

            for order_item_option in order_item.get("options"):
                new_order_option = OrderItemOption(
                    order_item_id = new_order_item.id,
                    option_item_id = order_item_option.get("id"),
                    option_name = order_item_option.get("name"),
                    option_price = order_item_option.get("price_modifier")
                )
                db.add(new_order_option)
                db.flush()

        cart_item_to_delete = db.query(CartItem).filter(CartItem.cart_id == cart.id)
        
        for item in cart_item_to_delete:
            db.delete(item)
            db.flush()


        payment_result = PaymentService.create_payment(
            order, 
            payload.get('payment_method'), 
            db
        )
        
        redirect_url = None
        if payload.get('payment_method') in ['gcash', 'paymaya']:
            payment_method_id = payload.get('payment_method_id')

            print(f"generating redirect pmi", payment_method_id)

            if not payment_method_id:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="payment_method_id is required for e‑wallet payments"
                )
            
            service = PayMongoService()
           

            callback_url = f"{FRONTEND_URL}/payment/callback?payment_intent_id={payment_result['payment_intent_id']}"

            attach_response = service.attach_payment_intent(
                intent_id=payment_result['payment_intent_id'],
                payment_method_id=payment_method_id,
                return_url=callback_url
            )
            print(f"done attach", attach_response)
            if 'data' in attach_response:
                print(f"within attach if start")

                next_action = attach_response['data']['attributes'].get('next_action')

                print(f"next_action", next_action)

                if next_action and next_action.get('type') == 'redirect':
                    redirect_url = next_action['redirect']['url']
                    print(f"redirect_url", redirect_url)

                else:
                    raise HTTPException(
                        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
                        detail="No redirect URL received"
                    )
            else:
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    detail="No redirect URL received from PayMongo"
                )
            
        db.commit()
        print(f"done commit redirect_url", redirect_url)
        response_data = {
            "order_id": order.id,
            "payment": payment_result
            }
        if redirect_url:
            response_data["redirect_url"] = redirect_url
        
        print(f"response_data", response_data)

        return response_data

    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))
    
    


@router.patch("/{order_id}/status")
def update_order_status(order_id: int, payload: dict, db: Session = Depends(get_db)):
    order = db.query(Order).filter(Order.id == order_id).first()

    if not order:
        raise HTTPException(status_code=404, detail="Order not found.")

    new_status = payload.get("status")
    if not new_status:
        raise HTTPException(status_code=400, detail="Status is required.")

    order.status = new_status
    db.commit()
    db.refresh(order)

    return {
        "message": "Order status updated successfully.",
        "order": {
            "id": order.id,
            "order_no": order.order_no,
            "status": order.status,
        }
    }

@router.get("/{order_id}/receipt")
def get_order(order_id: int, db: Session = Depends(get_db)):
    order = (
        db.query(Order)
        .options(
            selectinload(Order.items),
            selectinload(Order.payment)
        )
        .filter(Order.id == order_id)
        .first()
    )

    if not order:
        raise HTTPException(status_code=404, detail="Order not found.")

    return {
        "id": order.id,
        "order_no": order.order_no,
        "user_id": order.user_id,
        "email": order.email,
        "phone": order.phone,
        "order_type": order.order_type,
        "status": order.status,
        "subtotal": float(order.subtotal),
        "total_amount": float(order.total_amount),
        "created_at": order.created_at,
        "items": [
                {
                    "id": item.id,
                    "product_id": item.product_id,
                    "product_name": item.product.name if item.product else f"Product #{item.product_id}",
                    "quantity": item.quantity,
                    "unit_price": float(item.unit_price),
                    "option_total": float(item.option_total or 0),
                    "line_total": float(item.line_total),
                }
            for item in order.items
        ],
        "payment": {
            "id": order.payment.id,
            "payment_method": order.payment.payment_method,
            "payment_status": order.payment.payment_status,
            "total_amount": float(order.payment.total_amount or 0),
            "payment_intent_id": order.payment.payment_intent_id,
        } if order.payment else None,
    }
    # return {
    #     "id": order.id,
    #     "order_no": order.order_no,
    #     "customer_id": order.customer_id,
    #     "order_type": order.order_type,
    #     "status": order.status,
    #     "subtotal": float(order.subtotal),
    #     "total_amount": float(order.total_amount),
    #     "created_at": order.created_at,
    # }
