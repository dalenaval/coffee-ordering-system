from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.db.session import Base, engine
import app.models

from app.api.routes import users
from app.api.routes import products
from app.api.routes import categories
from app.api.routes import optionGroups
from app.api.routes import optionItems
from app.api.routes import productAttributes
from app.api.routes import orders
from app.api.routes import order_items
from app.api.routes import payment
from app.api.routes import dashboard
from app.api.routes import reports
from app.api.routes import system_control
from app.api.routes import employees
from app.api.routes import staff_scheduling

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Kape Nga Ni API")

origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:8000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(users.router)
app.include_router(products.router)
app.include_router(categories.router)
app.include_router(optionGroups.router)
app.include_router(optionItems.router)
app.include_router(productAttributes.router)
app.include_router(orders.router)
app.include_router(order_items.router)
app.include_router(payment.router)
app.include_router(dashboard.router)
app.include_router(reports.router)
app.include_router(system_control.router)
app.include_router(employees.router)
app.include_router(staff_scheduling.router)


@app.get("/")
def root():
    return {"message": "Kape Nga Ni API is running"}
