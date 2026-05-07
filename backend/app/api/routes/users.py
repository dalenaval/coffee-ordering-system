from fastapi import APIRouter, Depends, HTTPException, status,BackgroundTasks
from sqlalchemy.orm import Session

from app.db.deps import get_db
from app.models.user import User
from app.schemas.user import UserCreate, UserLogin, UserResponse, TokenSchema,UserDetailsResponse, CheckEmail, VerifyEmail
from app.core.security import  verify_password, create_jwt_token, hash_password, decode_verification_token
from app.services.auth import get_current_user
from app.services.verify_email import send_verification_email
from app.core.config import ACCESS_TOKEN_EXPIRE_MINUTES, VERIFICATION_TOKEN_EXPIRE_MINUTES

router = APIRouter(prefix="/users", tags=["Users"])


@router.post("/register", response_model=UserResponse)
def register_user(payload: UserCreate, bg: BackgroundTasks,db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.email == payload.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already exists."
        )

    new_user = User(
        full_name=payload.full_name,
        email=payload.email,
        password=hash_password(payload.password),  # ✅ bcrypt hash
        role=payload.role,
        is_active=True,
        is_verified=False
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    token = create_jwt_token({"sub":str(new_user.id)}, VERIFICATION_TOKEN_EXPIRE_MINUTES)

    try :
        bg.add_task(send_verification_email, new_user.email, token)

    except Exception as e:   
        print(f"Error sending verification email: {e}")
   

    return new_user


@router.post("/login", response_model=TokenSchema)
def login_user(payload: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == payload.email).first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password."
        )
 
    if not verify_password(payload.password, user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password."
        )
    
    if not user.is_verified:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email not verified. Please check your inbox."
        )

    token = create_jwt_token({"sub":str(user.id)},ACCESS_TOKEN_EXPIRE_MINUTES)
    return {
        "message": "Login successful",
        "access_token": token
    }


@router.post("/email/check")
def verify_email(payload: CheckEmail, db: Session = Depends(get_db)):
    if not payload.email:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="No email provided")
    
    exist = db.query(User).filter(User.email == payload.email).first()

    if exist:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already exist")
   
    return {"message":"success", "detail":"Email available"}

@router.post("/email/verify")
def verify_email_token(payload: VerifyEmail, db: Session = Depends(get_db)):
    if not payload.token:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="No token provided")
    
    user_id = decode_verification_token(payload.token)

    if not user_id:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid token")

    user = db.query(User).filter(User.id == user_id).first()

    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    user.is_verified = True
    db.commit()
    db.refresh(user)

    return {"message":"success", "detail":"Email verified successfully"}


@router.get("/", response_model=list[UserResponse])
def get_users(db: Session = Depends(get_db)):
    return db.query(User).order_by(User.id.desc()).all()



@router.get("/me", response_model=UserDetailsResponse)
def get_user_data(db: Session = Depends(get_db), user_id = Depends(get_current_user)):
    print(f"use_id", user_id)
    return db.query(User).where(User.id == user_id).first()




