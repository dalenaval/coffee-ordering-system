from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import users
from app.api.routes import products
from app.api.routes import categories
from app.api.routes import optionGroups
from app.api.routes import optionItems

app = FastAPI(title="Kape Nga Ni API")

origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(users.router)
app.include_router(products.router)
app.include_router(categories.router)
app.include_router(optionGroups.router)
app.include_router(optionItems.router)

@app.get("/")
def root():
    return {"message": "Kape Nga Ni API is running"}
