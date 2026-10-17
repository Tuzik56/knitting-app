from fastapi import APIRouter, Depends, HTTPException, Response
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from . import crud_users, auth_service
from .database import get_db
from .schemas import (
    AccessTokenResponse,
    RefreshTokenRequest,
    TokenPair,
    UserLogin,
    UserRead,
    UserRegister,
)
from .dependencies import get_current_user
from .models import User

router = APIRouter(prefix="/auth", tags=["Авторизация"])


@router.post("/register", response_model=UserRead, status_code=201)
def register(
    data: UserRegister,
    db: Session = Depends(get_db),
):
    existing_user = crud_users.get_user_by_username(
        db,
        data.username,
    )

    if existing_user is not None:
        raise HTTPException(
            status_code=409,
            detail="Этот логин уже занят",
        )

    try:
        return crud_users.create_user(db, data)
    except IntegrityError as error:
        db.rollback()

        if getattr(error.orig, "sqlstate", None) == "23505":
            raise HTTPException(
                status_code=409,
                detail="Этот логин уже занят",
            ) from None

        raise


@router.post("/login", response_model=TokenPair)
def login(
    data: UserLogin,
    db: Session = Depends(get_db),
):
    user = auth_service.authenticate_user(
        db,
        data.username,
        data.password,
    )

    if user is None:
        raise HTTPException(
            status_code=401,
            detail="Неверный логин или пароль",
            headers={"WWW-Authenticate": "Bearer"},
        )

    return auth_service.create_login_session(db, user)


@router.get("/me", response_model=UserRead)
def read_current_user(
    current_user: User = Depends(get_current_user),
):
    return current_user


@router.post("/refresh", response_model=AccessTokenResponse)
def refresh(
    data: RefreshTokenRequest,
    db: Session = Depends(get_db),
):
    result = auth_service.refresh_access_token(
        db,
        data.refresh_token,
    )

    if result is None:
        raise HTTPException(
            status_code=401,
            detail="Сессия недействительна или истекла. Войдите заново",
            headers={"WWW-Authenticate": "Bearer"},
        )

    return result


@router.post("/logout", status_code=204)
def logout(
    data: RefreshTokenRequest,
    db: Session = Depends(get_db),
):
    auth_service.revoke_refresh_session(
        db,
        data.refresh_token,
    )

    return Response(status_code=204)