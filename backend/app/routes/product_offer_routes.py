"""
Product offer API routes.
"""
from fastapi import APIRouter, HTTPException
from app.schemas.product_offer_schema import ProductOfferCreate, ProductOfferOut, ProductOfferUpdate
from app.models import product_offer as offer_model

router = APIRouter()


@router.post("/", response_model=dict)
def create_product_offer(offer: ProductOfferCreate):
    # Check if offer already exists
    existing = offer_model.check_existing_offer(offer.product_id, offer.provider_id)
    if existing:
        raise HTTPException(status_code=400, detail="Offer already exists for this product")

    offer_id = offer_model.create_product_offer(offer.product_id, offer.provider_id)
    return {"id": offer_id, "message": "Offer sent successfully"}


@router.get("/product/{product_id}", response_model=list)
def get_product_offers(product_id: int):
    offers = offer_model.get_product_offers(product_id)
    return offers


@router.get("/user/{user_id}", response_model=list)
def get_user_offers(user_id: int):
    offers = offer_model.get_user_product_offers(user_id)
    return offers


@router.put("/{offer_id}", response_model=dict)
def update_offer_status(offer_id: int, update: ProductOfferUpdate):
    if update.status not in ['accepted', 'declined']:
        raise HTTPException(status_code=400, detail="Invalid status. Must be 'accepted' or 'declined'")

    result = offer_model.update_offer_status(offer_id, update.status)
    if not result:
        raise HTTPException(status_code=404, detail="Offer not found")

    return {"message": f"Offer {update.status} successfully"}