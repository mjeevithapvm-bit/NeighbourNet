"""
User model helpers (simple SQL functions).
- Implemented: create_user, get_user_by_email, get_user_by_id
- Passwords: stored plain-text for the prototype (insecure - for teaching only)
"""
from app.database import fetch_one, execute


def create_user(name, email, password):
    query = "INSERT INTO users (name, email, password) VALUES (%s, %s, %s)"
    return execute(query, (name, email, password))


def get_user_by_email(email):
    query = "SELECT id, name, email, password, created_at FROM users WHERE email = %s"
    user = fetch_one(query, (email,))
    if user and user.get('created_at'):
        user['created_at'] = str(user['created_at'])
    return user


def get_user_by_id(user_id):
    query = "SELECT id, name, email, created_at FROM users WHERE id = %s"
    user = fetch_one(query, (user_id,))
    if user and user.get('created_at'):
        user['created_at'] = str(user['created_at'])
    return user
