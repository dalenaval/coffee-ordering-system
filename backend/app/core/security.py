from datetime import datetime, timedelta, timezone
from fastapi import HTTPException, status
from jose import jwt
import bcrypt
import base64
import httpx
from app.core.config import  SECRET_KEY, ALGORITHM, ACCESS_TOKEN_EXPIRE_MINUTES, GENERATE_QR_URL, PAYMENT_SECRET_KEY, VERIFICATION_TOKEN_EXPIRE_MINUTES

def hash_password(password: str) -> str:
    password_bytes = password.encode('utf-8')
    salt = bcrypt.gensalt()
    hashed_password = bcrypt.hashpw(password_bytes, salt)
    return hashed_password.decode('utf-8') 

def verify_password(plain_password: str, stored_password: str) -> bool:

    password_byte_encrypted = plain_password.encode('utf-8')
    stored_password_bytes = stored_password.encode('utf-8')
    
    return bcrypt.checkpw(password_byte_encrypted, stored_password_bytes)

def create_jwt_token(data:dict, token_expire_minutes: int):
    to_encode = data.copy()
    
    expire = datetime.now(timezone.utc) + timedelta(minutes=int(token_expire_minutes))

    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


def decode_verification_token(token):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        print(f"Decoded token payload: {payload}")  # Debug log
        if not payload.get("sub"):
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="No user ID in token")
        
        user_id = int(payload.get("sub"))
        return user_id
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Verification token has expired")
    except jwt.JWTError:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid verification token")