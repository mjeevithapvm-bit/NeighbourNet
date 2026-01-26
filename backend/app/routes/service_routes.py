"""
Service API routes.
"""
from fastapi import APIRouter
from app.models import service as service_model

router = APIRouter()


@router.post("/")
def add_service(payload: dict):
    # payload expected: provider_id, title, description
    sid = service_model.create_service(payload.get("provider_id"), payload.get("title"), payload.get("description"))
    return {"id": sid}


@router.get("/")
def list_services():
    return service_model.list_services()
