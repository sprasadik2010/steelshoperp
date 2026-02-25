from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer
from sqlmodel import Session, select
from . import database, models, crud, schemas, notifications, auth
from .database import get_session
import os

app = FastAPI(title="Steel Shop ERP - Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://steelshoperp.onrender.com",
        "http://localhost:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

security = HTTPBearer()

def get_current_user(credentials = Depends(security)) -> dict:
    token = credentials.credentials
    payload = auth.decode_token(token)
    if not payload:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
    return payload

def require_role(*roles: str):
    def role_checker(current_user: dict = Depends(get_current_user)):
        if current_user.get("role") not in roles:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Insufficient permissions")
        return current_user
    return role_checker


@app.on_event("startup")
def on_startup():
    database.init_db()


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/auth/register")
def register(payload: schemas.UserCreate):
    with Session(database.engine) as session:
        existing = crud.get_user_by_username(session, payload.username)
        if existing:
            raise HTTPException(status_code=400, detail="Username already exists")
        user = crud.create_user(session, payload.username, payload.email, payload.password, payload.full_name, payload.phone, payload.role)
        access_token = auth.create_access_token({"sub": user.username, "role": user.role, "user_id": user.id})
        return {
            "access_token": access_token,
            "token_type": "bearer",
            "user": {
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "full_name": user.full_name,
                "role": user.role,
                "is_active": user.is_active
            }
        }


@app.post("/auth/login")
def login(payload: schemas.LoginRequest):
    with Session(database.engine) as session:
        user = crud.authenticate_user(session, payload.username, payload.password)
        if not user or not user.is_active:
            raise HTTPException(status_code=401, detail="Invalid credentials")
        access_token = auth.create_access_token({"sub": user.username, "role": user.role, "user_id": user.id})
        return {
            "access_token": access_token,
            "token_type": "bearer",
            "user": {
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "full_name": user.full_name,
                "role": user.role,
                "is_active": user.is_active
            }
        }


@app.post("/dealers", response_model=schemas.DealerResponse)
def create_dealer(payload: schemas.DealerCreate, current_user: dict = Depends(get_current_user)):
    with Session(database.engine) as session:
        d = crud.create_dealer(session, payload.name, payload.phone, payload.email)
        return {"id": d.id, "name": d.name, "phone": d.phone, "email": d.email}


@app.get("/dealers", response_model=list[schemas.DealerResponse])
def list_dealers(current_user: dict = Depends(get_current_user)):
    with Session(database.engine) as session:
        ds = crud.get_dealers(session)
        return ds


@app.post("/customers", response_model=schemas.CustomerResponse)
def create_customer(payload: schemas.CustomerCreate, current_user: dict = Depends(get_current_user)):
    with Session(database.engine) as session:
        c = crud.create_customer(session, payload.name, payload.phone, payload.email)
        return {"id": c.id, "name": c.name, "phone": c.phone, "email": c.email}


@app.get("/customers", response_model=list[schemas.CustomerResponse])
def list_customers(current_user: dict = Depends(get_current_user)):
    with Session(database.engine) as session:
        cs = crud.get_customers(session)
        return cs


@app.post("/quotations")
def create_quotation(payload: schemas.QuotationCreate, current_user: dict = Depends(require_role("dealer"))):
    with Session(database.engine) as session:
        q = crud.create_quotation(session, payload)
        return {"id": q.id, "confirm_token": q.confirm_token}


@app.get("/quotations/{qid}")
def get_quotation(qid: int):
    with Session(database.engine) as session:
        q = crud.get_quotation(session, qid)
        if not q:
            raise HTTPException(status_code=404, detail="Quotation not found")
        prods = session.exec("SELECT * FROM product WHERE quotation_id = :qid", {"qid": qid}).all()
        return {"quotation": q, "products": prods}


@app.post("/quotations/{qid}/send_confirm")
def send_confirm(qid: int):
    with Session(database.engine) as session:
        q = crud.get_quotation(session, qid)
        if not q:
            raise HTTPException(status_code=404, detail="Quotation not found")
        # Send link (placeholder)
        message = f"Please confirm your quotation: /confirm/{q.confirm_token}"
        # Retrieve customer phone
        cust = session.get(models.Customer, q.customer_id)
        if cust and cust.phone:
            notifications.send_whatsapp(cust.phone, message)
        return {"ok": True, "token": q.confirm_token}


@app.post("/confirm/{token}")
def confirm(token: str):
    with Session(database.engine) as session:
        q = crud.confirm_by_token(session, token)
        if not q:
            raise HTTPException(status_code=404, detail="Invalid token")
        # Notify dealer
        dealer = session.get(models.Dealer, q.dealer_id)
        if dealer and dealer.phone:
            notifications.send_whatsapp(dealer.phone, f"Quotation {q.id} confirmed by customer")
        return {"ok": True, "quotation_id": q.id}


@app.get("/debug/quotations")
def debug_quotations():
    """Development-only endpoint to list quotations and their confirm tokens.
    Enable by setting ENABLE_DEBUG_QUOTATIONS=1 in the environment.
    """
    if os.getenv("ENABLE_DEBUG_QUOTATIONS", "0") != "1":
        raise HTTPException(status_code=404, detail="Not found")
    with Session(database.engine) as session:
        qs = session.exec(select(models.Quotation)).all()
        return [{"id": q.id, "confirm_token": q.confirm_token, "confirmed": q.confirmed} for q in qs]


@app.post("/quotations/{qid}/convert")
def convert(qid: int):
    with Session(database.engine) as session:
        order = crud.convert_to_order(session, qid)
        if not order:
            raise HTTPException(status_code=400, detail="Quotation not found or not confirmed")
        return {"order_id": order.id}


@app.post("/workorders")
def create_workorder(order_id: int):
    with Session(database.engine) as session:
        order = session.get(models.Order, order_id)
        if not order:
            raise HTTPException(status_code=404, detail="Order not found")
        wo = models.WorkOrder(order_id=order_id)
        session.add(wo)
        session.commit()
        session.refresh(wo)
        # notify dealer (placeholder)
        dealer = session.get(models.Dealer, order.dealer_id)
        if dealer and dealer.phone:
            notifications.send_whatsapp(dealer.phone, f"Work order {wo.id} created for order {order_id}")
        return {"workorder_id": wo.id}


@app.post("/workorders/{wid}/approve-dealer")
def approve_dealer(wid: int):
    with Session(database.engine) as session:
        wo = session.get(models.WorkOrder, wid)
        if not wo:
            raise HTTPException(status_code=404, detail="WorkOrder not found")
        wo.approved_by_dealer = True
        if wo.approved_by_customer:
            wo.locked = True
        session.add(wo)
        session.commit()
        return {"ok": True}


@app.post("/workorders/{wid}/approve-customer")
def approve_customer(wid: int):
    with Session(database.engine) as session:
        wo = session.get(models.WorkOrder, wid)
        if not wo:
            raise HTTPException(status_code=404, detail="WorkOrder not found")
        wo.approved_by_customer = True
        if wo.approved_by_dealer:
            wo.locked = True
        session.add(wo)
        session.commit()
        return {"ok": True}


@app.patch("/products/{pid}/status")
def update_product_status(pid: int, status: str):
    with Session(database.engine) as session:
        p = session.get(models.Product, pid)
        if not p:
            raise HTTPException(status_code=404, detail="Product not found")
        p.status = status
        session.add(p)
        session.commit()
        return {"ok": True, "status": p.status}


@app.post("/invoices/{order_id}")
def create_invoice(order_id: int, amount: float = 0.0):
    with Session(database.engine) as session:
        inv = models.Invoice(order_id=order_id, amount=amount)
        session.add(inv)
        session.commit()
        session.refresh(inv)
        return {"invoice_id": inv.id}


@app.post("/warranty/submit")
def submit_warranty(order_id: int, customer_id: int, details: str = ""):
    with Session(database.engine) as session:
        w = models.Warranty(order_id=order_id, customer_id=customer_id, details=details)
        session.add(w)
        session.commit()
        session.refresh(w)
        return {"warranty_id": w.id}


@app.post("/orders/{oid}/verify")
def verify_order(oid: int, order_taker: str = "admin", current_user: dict = Depends(require_role("order_taker"))):
    """Order Taker verification - price hidden from display, technical review hidden"""
    with Session(database.engine) as session:
        order = session.get(models.Order, oid)
        if not order:
            raise HTTPException(status_code=404, detail="Order not found")
        if order.locked:
            raise HTTPException(status_code=400, detail="Order already locked")
        order.verified = True
        order.verified_by = order_taker
        order.verified_at = models.datetime.utcnow()
        session.add(order)
        session.commit()
        return {"ok": True, "order_id": oid}


@app.post("/products/{pid}/approve-drawing")
def approve_drawing(pid: int):
    """Drawing department approves the drawing"""
    with Session(database.engine) as session:
        p = session.get(models.Product, pid)
        if not p:
            raise HTTPException(status_code=404, detail="Product not found")
        p.drawing_approved = True
        session.add(p)
        session.commit()
        return {"ok": True}


@app.post("/products/{pid}/lock-drawing")
def lock_drawing(pid: int):
    """Lock drawing - no more edits allowed"""
    with Session(database.engine) as session:
        p = session.get(models.Product, pid)
        if not p:
            raise HTTPException(status_code=404, detail="Product not found")
        if not p.drawing_approved:
            raise HTTPException(status_code=400, detail="Drawing must be approved before locking")
        p.drawing_locked = True
        session.add(p)
        session.commit()
        return {"ok": True}


@app.post("/products/{pid}/transfer-dept")
def transfer_to_dept(pid: int, next_dept: str):
    """Transfer product to next department (explicit forward)"""
    with Session(database.engine) as session:
        p = session.get(models.Product, pid)
        if not p:
            raise HTTPException(status_code=404, detail="Product not found")
        
        valid_depts = ["drawing", "cutting", "bending", "fabrication", "qc", "accessories", "painting", "final_qc", "wrapping", "billing"]
        if next_dept not in valid_depts:
            raise HTTPException(status_code=400, detail=f"Invalid dept. Must be one of {valid_depts}")
        
        p.current_dept = next_dept
        p.dept_status = "pending"
        session.add(p)
        session.commit()
        return {"ok": True, "current_dept": p.current_dept}


@app.post("/products/{pid}/qc-result")
def qc_result(pid: int, result: str, notes: str = "", current_user: dict = Depends(require_role("dept_head"))):
    """QC result: pass or fail. If fail, route back to fabrication"""
    with Session(database.engine) as session:
        p = session.get(models.Product, pid)
        if not p:
            raise HTTPException(status_code=404, detail="Product not found")
        
        if result not in ["pass", "fail"]:
            raise HTTPException(status_code=400, detail="Result must be 'pass' or 'fail'")
        
        p.qc_status = result
        p.qc_notes = notes
        
        if result == "pass":
            p.current_dept = "accessories"
            p.dept_status = "pending"
        else:
            # Fail - route back to fabrication
            p.route_back_to = "fabrication"
            p.current_dept = "fabrication"
            p.dept_status = "pending"
        
        session.add(p)
        session.commit()
        return {"ok": True, "qc_status": p.qc_status, "routed_to": p.current_dept}


@app.post("/products/{pid}/final-qc-result")
def final_qc_result(pid: int, result: str, notes: str = "", current_user: dict = Depends(require_role("dept_head"))):
    """Final QC result: pass or fail. If fail, route back to relevant dept"""
    with Session(database.engine) as session:
        p = session.get(models.Product, pid)
        if not p:
            raise HTTPException(status_code=404, detail="Product not found")
        
        if result not in ["pass", "fail"]:
            raise HTTPException(status_code=400, detail="Result must be 'pass' or 'fail'")
        
        p.qc_status = result
        p.qc_notes = notes
        
        if result == "pass":
            p.current_dept = "wrapping"
            p.dept_status = "pending"
        else:
            # Fail - route back to painting (most common failure point)
            p.route_back_to = "painting"
            p.current_dept = "painting"
            p.dept_status = "pending"
        
        session.add(p)
        session.commit()
        return {"ok": True, "final_qc_status": p.qc_status, "routed_to": p.current_dept}


@app.post("/shipments")
def create_shipment(order_id: int, address: str = ""):
    """Create shipment for order"""
    with Session(database.engine) as session:
        order = session.get(models.Order, order_id)
        if not order:
            raise HTTPException(status_code=404, detail="Order not found")
        
        ship = models.Shipment(order_id=order_id, address=address)
        session.add(ship)
        session.commit()
        session.refresh(ship)
        return {"shipment_id": ship.id}


@app.post("/shipments/{sid}/send-whatsapp")
def send_delivery_whatsapp(sid: int):
    """Send WhatsApp notification to dealer about delivery"""
    with Session(database.engine) as session:
        ship = session.get(models.Shipment, sid)
        if not ship:
            raise HTTPException(status_code=404, detail="Shipment not found")
        
        order = session.get(models.Order, ship.order_id)
        if not order:
            raise HTTPException(status_code=404, detail="Order not found")
        
        dealer = session.get(models.Dealer, order.dealer_id)
        if dealer and dealer.phone:
            msg = f"Order {order.id} is ready for delivery to {ship.address or 'customer address'}. Shipment ID: {ship.id}"
            notifications.send_whatsapp(dealer.phone, msg)
        
        ship.whatsapp_sent = True
        session.add(ship)
        session.commit()
        return {"ok": True}

