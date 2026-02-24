from sqlmodel import Session, select
from . import models
from .database import engine
from .auth import get_password_hash, verify_password
from typing import Optional
import secrets

def create_user(session: Session, username: str, email: str, password: str, full_name: Optional[str], phone: Optional[str], role: str):
    hashed_pwd = get_password_hash(password)
    user = models.User(
        username=username,
        email=email,
        hashed_password=hashed_pwd,
        full_name=full_name,
        phone=phone,
        role=role
    )
    session.add(user)
    session.commit()
    session.refresh(user)
    return user

def get_user_by_username(session: Session, username: str):
    return session.exec(select(models.User).where(models.User.username == username)).first()

def authenticate_user(session: Session, username: str, password: str):
    user = get_user_by_username(session, username)
    if not user or not verify_password(password, user.hashed_password):
        return None
    return user

def create_quotation(session: Session, quotation_in):
    # Resolve or create dealer
    dealer_id = None
    if getattr(quotation_in, 'dealer_id', None):
        dealer_id = quotation_in.dealer_id
    elif getattr(quotation_in, 'dealer', None):
        d = create_dealer(session, quotation_in.dealer.name, getattr(quotation_in.dealer, 'phone', None), getattr(quotation_in.dealer, 'email', None))
        dealer_id = d.id

    # Resolve or create customer
    customer_id = None
    if getattr(quotation_in, 'customer_id', None):
        customer_id = quotation_in.customer_id
    elif getattr(quotation_in, 'customer', None):
        c = create_customer(session, quotation_in.customer.name, getattr(quotation_in.customer, 'phone', None), getattr(quotation_in.customer, 'email', None))
        customer_id = c.id

    if dealer_id is None or customer_id is None:
        raise ValueError('dealer_id or dealer info, and customer_id or customer info must be provided')

    q = models.Quotation(dealer_id=dealer_id, customer_id=customer_id)
    q.confirm_token = secrets.token_urlsafe(16)
    session.add(q)
    session.commit()
    session.refresh(q)
    for p in quotation_in.products:
        prod = models.Product(quotation_id=q.id, name=p.name, qty=p.qty)
        session.add(prod)
    session.commit()
    return q

def get_quotation(session: Session, qid: int):
    return session.exec(select(models.Quotation).where(models.Quotation.id == qid)).first()

def confirm_by_token(session: Session, token: str):
    q = session.exec(select(models.Quotation).where(models.Quotation.confirm_token == token)).first()
    if not q:
        return None
    q.confirmed = True
    session.add(q)
    session.commit()
    session.refresh(q)
    return q

def convert_to_order(session: Session, qid: int):
    q = get_quotation(session, qid)
    if not q or not q.confirmed:
        return None
    order = models.Order(quotation_id=q.id, dealer_id=q.dealer_id, customer_id=q.customer_id)
    session.add(order)
    session.commit()
    session.refresh(order)
    # move products
    prods = session.exec(select(models.Product).where(models.Product.quotation_id == q.id)).all()
    for p in prods:
        p.order_id = order.id
        session.add(p)
    session.commit()
    return order

def create_dealer(session: Session, name: str, phone: Optional[str] = None, email: Optional[str] = None):
    dealer = models.Dealer(name=name, phone=phone, email=email)
    session.add(dealer)
    session.commit()
    session.refresh(dealer)
    return dealer

def get_dealers(session: Session):
    return session.exec(select(models.Dealer)).all()

def create_customer(session: Session, name: str, phone: Optional[str] = None, email: Optional[str] = None):
    customer = models.Customer(name=name, phone=phone, email=email)
    session.add(customer)
    session.commit()
    session.refresh(customer)
    return customer

def get_customers(session: Session):
    return session.exec(select(models.Customer)).all()
