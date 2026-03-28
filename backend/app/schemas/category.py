
from pydantic import BaseModel

class CategoryCreate (BaseModel):
    name: str
    
class CategoryResponse(BaseModel):
    name: str

    class Config:
        orm_mode = True
        