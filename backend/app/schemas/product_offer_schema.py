"""
Pydantic schemas for product offers.
"""
from pydantic import BaseModel
from typing import Optional


class ProductOfferCreate(BaseModel):
    product_id: int
    provider_id: int


class ProductOfferOut(BaseModel):
    id: int
    product_id: int
    provider_id: int
    status: str
    provider_name: Optional[str]
    created_at: Optional[str]
    updated_at: Optional[str]

    class Config:
        from_attributes = True


class ProductOfferUpdate(BaseModel):
    status: str  # 'accepted' or 'declined'