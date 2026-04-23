from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.db.session import Base, engine
import app.models

from app.api.routes import users
from app.api.routes import products
from app.api.routes import categories
from app.api.routes import option_groups
from app.api.routes import option_items
from app.api.routes import product_attributes
from app.api.routes import orders
from app.api.routes import order_items
from app.api.routes import dashboard
from app.api.routes import menu
from app.api.routes import cart
from app.api.routes import reports
from app.api.routes import system_control
from app.api.routes import employees
from app.api.routes import staff_scheduling
from app.api.routes import payments

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
app.include_router(option_groups.router)
app.include_router(option_items.router)
app.include_router(product_attributes.router)
app.include_router(orders.router)
app.include_router(order_items.router)
app.include_router(payments.router)
app.include_router(menu.router)
app.include_router(dashboard.router)
app.include_router(cart.router)
app.include_router(dashboard.router)
app.include_router(reports.router)
app.include_router(system_control.router)
app.include_router(employees.router)
app.include_router(staff_scheduling.router)

@app.get("/")
def root():
    return {"message": "Kape Nga Ni API is running"}
