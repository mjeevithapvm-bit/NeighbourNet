"""
Loan API routes.
"""
from fastapi import APIRouter
from app.models import loan as loan_model

router = APIRouter()


@router.post("/")
def create_loan(payload: dict):
    lid = loan_model.create_loan(payload.get("lender_id"), payload.get("borrower_id"), payload.get("item"), payload.get("amount", 0))
    return {"id": lid}


@router.get("/")
def list_loans():
    return loan_model.list_loans()
