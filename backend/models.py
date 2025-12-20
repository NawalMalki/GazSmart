'''
Définition de la structure de la base de données 
'''


from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime


# Les requests 
class SignupRequest(BaseModel):
    email: EmailStr
    password: str
    full_name: str

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class GoogleAuthRequest(BaseModel):
    token: str


# Les responses 
class UserResponse(BaseModel):
    id: int
    email: str
    full_name: str
    profile_picture: Optional[str] = None
    google_id: Optional[str] = None
    created_at: datetime

class AuthResponse(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse

class TokenData(BaseModel):
    email: Optional[str] = None