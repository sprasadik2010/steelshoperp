from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import datetime

class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    username: str = Field(unique=True, index=True)
    email: str = Field(unique=True, index=True)
    hashed_password: str
    role: str  # dealer, customer, order_taker, dept_head
    full_name: Optional[str] = None
    phone: Optional[str] = None
    is_active: bool = True
    created_at: datetime = Field(default_factory=datetime.utcnow)

class Dealer(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    phone: Optional[str] = None
    email: Optional[str] = None

class Customer(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    phone: Optional[str] = None
    email: Optional[str] = None

class Quotation(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    dealer_id: int = Field(foreign_key="dealer.id")
    customer_id: int = Field(foreign_key="customer.id")
    total: float = 0.0
    confirmed: bool = False
    confirm_token: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

class Product(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    quotation_id: Optional[int] = Field(default=None, foreign_key="quotation.id")
    order_id: Optional[int] = Field(default=None, foreign_key="order.id")
    name: str
    qty: int = 1
    status: str = "created"
    current_dept: str = "drawing"  # drawing, cutting, bending, fabrication, qc, accessories, painting, final_qc, wrapping, billing
    dept_status: str = "pending"  # pending, in_progress, completed
    qc_status: Optional[str] = None  # pass, fail (for QC)
    qc_notes: Optional[str] = None
    route_back_to: Optional[str] = None  # if QC fails, route back to dept
    drawing_approved: bool = False
    drawing_locked: bool = False

class Order(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    quotation_id: Optional[int] = Field(default=None, foreign_key="quotation.id")
    dealer_id: int = Field(foreign_key="dealer.id")
    customer_id: int = Field(foreign_key="customer.id")
    created_at: datetime = Field(default_factory=datetime.utcnow)
    locked: bool = False
    verified: bool = False
    verified_by: Optional[str] = None  # order_taker role name
    verified_at: Optional[datetime] = None

class WorkOrder(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    order_id: int = Field(foreign_key="order.id")
    created_at: datetime = Field(default_factory=datetime.utcnow)
    approved_by_dealer: bool = False
    approved_by_customer: bool = False
    locked: bool = False

class Invoice(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    order_id: int = Field(foreign_key="order.id")
    amount: float = 0.0
    created_at: datetime = Field(default_factory=datetime.utcnow)

class Warranty(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    order_id: int = Field(foreign_key="order.id")
    customer_id: int = Field(foreign_key="customer.id")
    details: Optional[str] = None
    approved: bool = False

class Shipment(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    order_id: int = Field(foreign_key="order.id")
    address: Optional[str] = None
    dispatched_at: datetime = Field(default_factory=datetime.utcnow)
    whatsapp_sent: bool = False

