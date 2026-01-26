"""
Complaint model helpers.
"""
from app.database import fetch_all, execute


def create_complaint(user_id, title, description):
    query = "INSERT INTO complaints (user_id, title, description) VALUES (%s, %s, %s)"
    return execute(query, (user_id, title, description))


def list_complaints():
    query = "SELECT id, user_id, title, description, status, created_at FROM complaints ORDER BY created_at DESC"
    return fetch_all(query)
