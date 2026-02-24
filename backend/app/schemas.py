from pydantic import BaseModel
from typing import List, Optional


class DealerCreate(BaseModel):
    name: str
    phone: Optional[str] = None
    email: Optional[str] = None


class DealerResponse(BaseModel):
    id: int
    name: str
    phone: Optional[str]
    email: Optional[str]


class CustomerCreate(BaseModel):
    name: str
    phone: Optional[str] = None
    email: Optional[str] = None


class CustomerResponse(BaseModel):
    id: int
    name: str
    phone: Optional[str]
    email: Optional[str]


class ProductCreate(BaseModel):
    name: str
    qty: int = 1

class QuotationCreate(BaseModel):
    dealer_id: Optional[int] = None
    customer_id: Optional[int] = None
    dealer: Optional[DealerCreate] = None
    customer: Optional[CustomerCreate] = None
    products: List[ProductCreate]

class ConfirmResponse(BaseModel):
    ok: bool
    quotation_id: int

class UserCreate(BaseModel):
    username: str
    email: str
    password: str
    full_name: Optional[str] = None
    phone: Optional[str] = None
    role: str  # dealer, customer, order_taker, dept_head

class UserResponse(BaseModel):
    id: int
    username: str
    email: str
    full_name: Optional[str]
    role: str
    is_active: bool

class LoginRequest(BaseModel):
    username: str
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse
