from pydantic import BaseModel, EmailStr,ConfigDict


class UserCreate(BaseModel):
    full_name: str
    email: EmailStr
    password: str
    role: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str

class VerifyEmail(BaseModel):
    email: EmailStr
class TokenSchema(BaseModel):
    access_token: str
    token_type:str="bearer"

class UserDetailsResponse(BaseModel):
    full_name: str
    email: EmailStr
    role: str
    is_active: bool
class UserResponse(BaseModel):
    id: int
    full_name: str
    email: EmailStr
    role: str
    is_active: bool

    model_config = ConfigDict(from_attributes=True)

        