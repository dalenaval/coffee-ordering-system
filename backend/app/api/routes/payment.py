from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.deps import get_db
from app.models.payment import Payment
from app.models.orders import Order

import base64
import httpx

from app.core.config import PAYMENT_SECRET_KEY, GENERATE_QR_URL

router = APIRouter(prefix="/payments", tags=["Payments"])


@router.get("/")
def get_payments(db: Session = Depends(get_db)):
    rows = (
        db.query(Payment, Order)
        .join(Order, Payment.order_id == Order.id)
        .order_by(Payment.id.desc())
        .all()
    )

    result = []
    for payment, order in rows:
        result.append({
            "id": payment.id,
            "order_id": payment.order_id,
            "order_no": order.order_no if order else None,
            "payment_method": payment.payment_method,
            "payment_status": payment.payment_status,
            "amount": float(payment.amount),
            "reference_no": payment.reference_no,
            "paid_at": payment.paid_at,
            "created_at": payment.created_at,
        })

    return result

# @router.post("/process-checkout")
# async def create_payment(payload:dict, db : Session = Depends(get_db)):
#     payment = db.query(Payment).filter(Payment.order_no == payload.get('order_no')).first()

#     if payment:
#         raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, 
#                             detail="Order already exist") 
    
#     new_payment = Payment(
#         order_id = payload.get('order_id'),
#         payment_method = payload.get('payment_method'),
#         payment_status = "Pending",
#         amount = payload.get('total_amount')
#     )
#     db.add(new_payment)
#     db.flush()
#     db.refresh(new_payment)

#     url = GENERATE_QR_URL

#     auth_str = f"{PAYMENT_SECRET_KEY}"
#     encoded_auth = base64.b64encode(auth_str.encode()).decode()

#     payload = {
#         "data":{
#             "attributes":{
#                 "amount": int(payload.get('total_amount') * 100),
#                 "type" : "qrph",
#                 "currency": "PHP"
#             }
#         }
#     }
#     headers = {
#         "Authorization" : f"Basic {encoded_auth}",
#         "Content-type" : "application/json",
#         "accept" : "application/json"
#     }

#     async with httpx.AsyncClient() as client:
#         response = await client.post(url, json=payload, headers=headers)

#     if response.status_code != 200:
#         raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Error in generating QR")
    
#     data = response.json()
#     qr_image = data['data']['attributes']['qr_image']
#     ref_id = data['data']['id']

#     payment = db.query(Payment).filter(Payment.order_id == payload.get('order_id')).first()

#     if not payment:
#         raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Payment order is not found")

#     payment.reference_no = ref_id
    
#     db.commit()
#     db.refresh(payment)

#     return {
#         "status": "success",
#         "order_id":payload.get('order_id'),
#         "qr_image":qr_image
#     }



# @router.post('/generate-qr')
# async def generate_qr(order_id:str, amount:float, db: Session = Depends(get_db)):
#     url = GENERATE_QR_URL

#     auth_str = f"{PAYMENT_SECRET_KEY}"
#     encoded_auth = base64.b64encode(auth_str.encode()).decode()

#     payload = {
#         "data":{
#             "attributes":{
#                 "amount": int(amount * 100),
#                 "type" : "qrph",
#                 "currency": "PHP"
#             }
#         }
#     }
#     headers = {
#         "Authorization" : f"Basic {encoded_auth}",
#         "Content-type" : "application/json",
#         "accept" : "application/json"
#     }

#     async with httpx.AsyncClient() as client:
#         response = await client.post(url, json=payload, headers=headers)

#     if response.status_code != 200:
#         raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Error in generating QR")
    
#     data = response.json()
#     qr_image = data['data']['attributes']['qr_image']
#     ref_id = data['data']['id']

#     payment = db.query(Payment).filter(Payment.order_id == order_id).first()

#     if not payment:
#         raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Payment order is not found")

#     payment.reference_no = ref_id
    
#     db.commit()
#     db.refresh(payment)

#     return {
#         "status": "success",
#         "order_id":order_id,
#         "qr_image":qr_image
#     }
