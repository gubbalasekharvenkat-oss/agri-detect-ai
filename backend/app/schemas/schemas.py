
from pydantic import BaseModel, EmailStr
from typing import List, Optional
from datetime import datetime

# Token Schemas
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

# User Schemas
class UserBase(BaseModel):
    email: EmailStr
    full_name: Optional[str] = None

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int
    class Config:
        from_attributes = True

# Detection Schemas
class DetectionCreate(BaseModel):
    latitude: Optional[float] = None
    longitude: Optional[float] = None

class DetectionResponse(BaseModel):
    id: int
    disease_name: str
    confidence: float
    severity: str
    treatment: List[str]
    latitude: Optional[float]
    longitude: Optional[float]
    created_at: datetime
    
    class Config:
        from_attributes = True
