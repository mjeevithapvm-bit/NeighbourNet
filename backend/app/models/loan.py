"""
Loan model helpers.
"""
from app.database import fetch_all, execute


def create_loan(lender_id, borrower_id, item, amount):
    query = "INSERT INTO loans (lender_id, borrower_id, item, amount) VALUES (%s, %s, %s, %s)"
    return execute(query, (lender_id, borrower_id, item, amount))


def list_loans():
    query = "SELECT id, lender_id, borrower_id, item, amount, status, created_at FROM loans ORDER BY created_at DESC"
    loans = fetch_all(query)
    for loan in loans:
        if loan.get('created_at'):
            loan['created_at'] = str(loan['created_at'])
    return loans
