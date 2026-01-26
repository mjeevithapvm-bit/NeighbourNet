"""
User API routes (register, login, get user).
- Simple authentication: verify email/password via DB query.
- No tokens; response includes user info only.
"""
from fastapi import APIRouter, HTTPException
from app.schemas.user_schema import UserCreate, UserLogin, UserOut
from app.models import user as user_model

router = APIRouter()


@router.post("/register", response_model=UserOut)
def register(u: UserCreate):
    existing = user_model.get_user_by_email(u.email)
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    user_id = user_model.create_user(u.name, u.email, u.password)
    user = user_model.get_user_by_id(user_id)
    return user


@router.post("/login", response_model=UserOut)
def login(payload: UserLogin):
    user = user_model.get_user_by_email(payload.email)
    if not user or user.get("password") != payload.password:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    # Remove password before returning
    user.pop("password", None)
    return user


@router.get("/{user_id}", response_model=UserOut)
def get_user(user_id: int):
    user = user_model.get_user_by_id(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user
