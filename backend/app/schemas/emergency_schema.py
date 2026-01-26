"""
Pydantic schemas for emergencies.
"""
from pydantic import BaseModel
from typing import Optional


class EmergencyCreate(BaseModel):
    user_id: Optional[int] = None
    message: str
    location: Optional[str] = None


class EmergencyOut(BaseModel):
    id: int
    user_id: Optional[int]
    message: str
    location: Optional[str]
    resolved: int
    created_at: Optional[str]

    class Config:
        orm_mode = True
