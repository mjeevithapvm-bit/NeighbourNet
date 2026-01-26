"""
Product model helpers.
"""
from app.database import fetch_all, fetch_one, execute


def create_product(owner_id, title, description):
    query = "INSERT INTO products (owner_id, title, description) VALUES (%s, %s, %s)"
    return execute(query, (owner_id, title, description))


def list_products():
    query = """
    SELECT p.id, p.owner_id, p.title, p.description, p.available, p.created_at,
           u.name as owner_name,
           po.provider_id, po.status as offer_status, provider.name as provider_name
    FROM products p
    JOIN users u ON p.owner_id = u.id
    LEFT JOIN product_offers po ON p.id = po.product_id AND po.status = 'accepted'
    LEFT JOIN users provider ON po.provider_id = provider.id
    ORDER BY p.created_at DESC
    """
    products = fetch_all(query)
    for product in products:
        if product.get('created_at'):
            product['created_at'] = str(product['created_at'])
    return products


def get_product(product_id):
    query = "SELECT id, owner_id, title, description, available, created_at FROM products WHERE id = %s"
    product = fetch_one(query, (product_id,))
    if product and product.get('created_at'):
        product['created_at'] = str(product['created_at'])
    return product
