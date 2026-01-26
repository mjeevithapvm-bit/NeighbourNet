"""
Pydantic schemas for products.
"""
from pydantic import BaseModel
from typing import Optional


class ProductCreate(BaseModel):
    owner_id: int
    title: str
    description: Optional[str] = None


class ProductOut(BaseModel):
    id: int
    owner_id: int
    title: str
    description: Optional[str]
    available: int
    created_at: Optional[str]

    class Config:
        orm_mode = True
