from fastapi import APIRouter, Depends,HTTPException
from sqlalchemy.orm import Session

from backend.app.database.dependencies import get_db
from backend.app.models.user import User
from backend.app.schemas.user import (
    UserCreate,
    UserResponse,
    UserLogin
)
from backend.app.core.security import (
    hash_password,
    verify_password
)

router = APIRouter(prefix="/users", tags=["Users"])


@router.post("/", response_model=UserResponse)
def create_user(user: UserCreate, db: Session = Depends(get_db)):

    existing_user = db.query(User).filter(
        User.email == user.email
    ).first()

    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Email already registered"
    )

    db_user = User(
        name=user.name,
        email=user.email,
        password=hash_password(user.password)
    )

    db.add(db_user)
    db.commit()
    db.refresh(db_user)

    return db_user

@router.post("/login")
def login(
    user: UserLogin,
    db: Session = Depends(get_db)
):

    db_user = db.query(User).filter(
        User.email == user.email
    ).first()

    if not db_user:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
    )
    if not verify_password(
        user.password,
        db_user.password
):
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
    )

    return {
        "message": "Login successful"
    }