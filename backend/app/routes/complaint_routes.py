"""
Complaint API routes.
"""
from fastapi import APIRouter
from app.models import complaint as complaint_model

router = APIRouter()


@router.post("/")
def create_complaint(payload: dict):
    cid = complaint_model.create_complaint(payload.get("user_id"), payload.get("title"), payload.get("description"))
    return {"id": cid}


@router.get("/")
def list_complaints():
    return complaint_model.list_complaints()
