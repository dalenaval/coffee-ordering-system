
from pydantic import BaseModel, ConfigDict

class CategoryCreate (BaseModel):
    id: int
    name: str
    
class CategoryResponse(BaseModel):
    id: int
    name: str

    model_config = ConfigDict(from_attributes=True)
    # class Config:
    #     orm_mode = True
        