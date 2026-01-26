"""
Emergency model helpers.
"""
from app.database import fetch_all, execute


def create_emergency(user_id, message, location):
    query = "INSERT INTO emergencies (user_id, message, location) VALUES (%s, %s, %s)"
    return execute(query, (user_id, message, location))


def list_emergencies():
    query = "SELECT id, user_id, message, location, resolved, created_at FROM emergencies ORDER BY created_at DESC"
    emergencies = fetch_all(query)
    for emergency in emergencies:
        if emergency.get('created_at'):
            emergency['created_at'] = str(emergency['created_at'])
    return emergencies
