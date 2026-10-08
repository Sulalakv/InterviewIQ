from fastapi import APIRouter, Depends,HTTPException
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordRequestForm

from backend.app.database.dependencies import get_db
from backend.app.models.user import User
from backend.app.schemas.user import (
    UserCreate,
    UserResponse,
    
)
from backend.app.core.security import (
    hash_password,
    verify_password,
    create_access_token
)
from backend.app.core.oauth2 import (
    oauth2_scheme,
    get_current_user
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
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):

    db_user = db.query(User).filter(
        User.email == form_data.username
    ).first()

    if not db_user:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
    )
    if not verify_password(
        form_data.password,
        db_user.password
):
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
    )
    access_token = create_access_token(
        data={
            "sub": db_user.email
    }
)

    return {
    "access_token": access_token,
    "token_type": "bearer"
}
@router.get("/token-test")
def token_test(token: str = Depends(oauth2_scheme)):
    return {
        "token": token
    }

@router.get("/me", response_model=UserResponse)
def get_me(
    current_user: User = Depends(get_current_user)
):
    return current_user