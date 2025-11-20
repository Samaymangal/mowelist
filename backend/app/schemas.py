from pydantic import BaseModel, EmailStr
from datetime import date

class RegisterRequest(BaseModel):
    email: EmailStr
    username: str
    name: str
    dob: str
    password: str

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"

class UserOut(BaseModel):
    id: int
    email: EmailStr
    username: str
    name: str
    dob: date

    class Config:
        from_attributes = True
