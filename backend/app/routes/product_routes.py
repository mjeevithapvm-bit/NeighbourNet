"""
Product API routes.
"""
from fastapi import APIRouter, HTTPException
from app.schemas.product_schema import ProductCreate, ProductOut
from app.models import product as product_model

router = APIRouter()


@router.post("/", response_model=dict)
def add_product(p: ProductCreate):
    pid = product_model.create_product(p.owner_id, p.title, p.description)
    return {"id": pid}


@router.get("/", response_model=list)
def list_products():
    items = product_model.list_products()
    return items


@router.get("/{product_id}", response_model=dict)
def get_product(product_id: int):
    item = product_model.get_product(product_id)
    if not item:
        raise HTTPException(status_code=404, detail="Product not found")
    return item
