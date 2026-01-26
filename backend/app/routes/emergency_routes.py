"""
Emergency API routes.
- / (POST) create emergency
- / (GET) list emergencies
- /sms-mock (POST) conceptual endpoint to show how SMS/voice could be triggered.

Implemented: DB storage & list.
Conceptual: SMS/voice integration is mocked - no external service calls.
"""
from fastapi import APIRouter
from app.models import emergency as emergency_model

router = APIRouter()


@router.post("/")
def create_emergency(payload: dict):
    eid = emergency_model.create_emergency(payload.get("user_id"), payload.get("message"), payload.get("location"))
    return {"id": eid}


@router.get("/")
def list_emergencies():
    return emergency_model.list_emergencies()


@router.post("/sms-mock")
def sms_mock(payload: dict):
    """Conceptual mock: pretend to send an SMS alert.
    Frontend can call this to simulate offline/SMS access.
    """
    # In a real app you'd call Twilio or another gateway here.
    # For prototype, just echo the request and pretend it was sent.
    return {"sent": True, "payload": payload}
