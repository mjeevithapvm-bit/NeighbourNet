"""
Product offer model helpers.
"""
from app.database import fetch_all, fetch_one, execute


def create_product_offer(product_id, provider_id):
    query = "INSERT INTO product_offers (product_id, provider_id) VALUES (%s, %s)"
    return execute(query, (product_id, provider_id))


def get_product_offers(product_id):
    query = """
    SELECT po.id, po.product_id, po.provider_id, po.status, po.created_at, po.updated_at,
           u.name as provider_name
    FROM product_offers po
    JOIN users u ON po.provider_id = u.id
    WHERE po.product_id = %s
    ORDER BY po.created_at DESC
    """
    offers = fetch_all(query, (product_id,))
    for offer in offers:
        if offer.get('created_at'):
            offer['created_at'] = str(offer['created_at'])
        if offer.get('updated_at'):
            offer['updated_at'] = str(offer['updated_at'])
    return offers


def get_user_product_offers(user_id):
    query = """
    SELECT po.id, po.product_id, po.provider_id, po.status, po.created_at, po.updated_at,
           p.title as product_title, p.description as product_description,
           u.name as provider_name, owner.name as requester_name
    FROM product_offers po
    JOIN products p ON po.product_id = p.id
    JOIN users u ON po.provider_id = u.id
    JOIN users owner ON p.owner_id = owner.id
    WHERE po.provider_id = %s OR p.owner_id = %s
    ORDER BY po.updated_at DESC
    """
    offers = fetch_all(query, (user_id, user_id))
    for offer in offers:
        if offer.get('created_at'):
            offer['created_at'] = str(offer['created_at'])
        if offer.get('updated_at'):
            offer['updated_at'] = str(offer['updated_at'])
    return offers


def update_offer_status(offer_id, status):
    query = "UPDATE product_offers SET status = %s WHERE id = %s"
    return execute(query, (status, offer_id))


def get_offer_by_id(offer_id):
    query = """
    SELECT po.id, po.product_id, po.provider_id, po.status, po.created_at, po.updated_at,
           p.title as product_title, p.owner_id as requester_id,
           u.name as provider_name, owner.name as requester_name
    FROM product_offers po
    JOIN products p ON po.product_id = p.id
    JOIN users u ON po.provider_id = u.id
    JOIN users owner ON p.owner_id = owner.id
    WHERE po.id = %s
    """
    offer = fetch_one(query, (offer_id,))
    if offer:
        if offer.get('created_at'):
            offer['created_at'] = str(offer['created_at'])
        if offer.get('updated_at'):
            offer['updated_at'] = str(offer['updated_at'])
    return offer


def check_existing_offer(product_id, provider_id):
    query = "SELECT id FROM product_offers WHERE product_id = %s AND provider_id = %s"
    return fetch_one(query, (product_id, provider_id))