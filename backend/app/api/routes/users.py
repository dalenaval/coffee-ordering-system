from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.deps import get_db
from app.models.user import User
from app.schemas.user import UserCreate, UserLogin, UserResponse, TokenSchema,UserDetailsResponse
from app.core.security import verify_password, create_access_token, hash_password
from app.services.auth import get_current_user

router = APIRouter(prefix="/users", tags=["Users"])


@router.post("/register", response_model=UserResponse)
def register_user(payload: UserCreate, db: Session = Depends(get_db)):
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
        is_active=True
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

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

    token = create_access_token({"sub":str(user.id)})
    return {
        "message": "Login successful",
        "access_token": token
    }


@router.get("/", response_model=list[UserResponse])
def get_users(db: Session = Depends(get_db)):
    return db.query(User).order_by(User.id.desc()).all()


@router.get("/me", response_model=UserDetailsResponse)
def get_user_data(db: Session = Depends(get_db), user_id = Depends(get_current_user)):
    print(f"use_id", user_id)
    return db.query(User).where(User.id == user_id).first()
