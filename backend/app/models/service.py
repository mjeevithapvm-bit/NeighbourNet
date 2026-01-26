"""
Service model helpers.
"""
from app.database import fetch_all, execute


def create_service(provider_id, title, description):
    query = "INSERT INTO services (provider_id, title, description) VALUES (%s, %s, %s)"
    return execute(query, (provider_id, title, description))


def list_services():
    query = "SELECT id, provider_id, title, description, created_at FROM services ORDER BY created_at DESC"
    services = fetch_all(query)
    for service in services:
        if service.get('created_at'):
            service['created_at'] = str(service['created_at'])
    return services
