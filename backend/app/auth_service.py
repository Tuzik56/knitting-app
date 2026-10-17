from datetime import datetime, timedelta, timezone

from sqlalchemy.orm import Session

from . import crud_users
from .config import ACCESS_TOKEN_MINUTES, REFRESH_TOKEN_DAYS
from .models import RefreshSession, User
from .schemas import AccessTokenResponse, TokenPair
from sqlalchemy import select
from .security import (
    DUMMY_PASSWORD_HASH,
    create_access_token,
    create_refresh_token,
    hash_refresh_token,
    verify_password,
)


def authenticate_user(
    db: Session,
    username: str,
    password: str,
) -> User | None:
    user = crud_users.get_user_by_username(db, username)

    password_hash = (
        user.password_hash
        if user is not None
        else DUMMY_PASSWORD_HASH
    )

    password_is_valid = verify_password(password, password_hash)

    if user is None or not password_is_valid:
        return None

    return user


def create_login_session(db: Session, user: User) -> TokenPair:
    refresh_token = create_refresh_token()
    access_token = create_access_token(user.id)

    session = RefreshSession(
        user_id=user.id,
        token_hash=hash_refresh_token(refresh_token),
        expires_at=(
            datetime.now(timezone.utc)
            + timedelta(days=REFRESH_TOKEN_DAYS)
        ),
        revoked_at=None,
    )

    db.add(session)
    db.commit()

    return TokenPair(
        access_token=access_token,
        refresh_token=refresh_token,
        expires_in=ACCESS_TOKEN_MINUTES * 60,
    )

def find_refresh_session(db: Session, refresh_token: str):
    return db.scalar(
        select(RefreshSession)
        .where(
            RefreshSession.token_hash
            == hash_refresh_token(refresh_token)
        )
        .with_for_update()
    )


def refresh_access_token(
    db: Session,
    refresh_token: str,
) -> AccessTokenResponse | None:
    session = find_refresh_session(db, refresh_token)
    now = datetime.now(timezone.utc)

    if (
        session is None
        or session.revoked_at is not None
        or session.expires_at <= now
    ):
        db.rollback()
        return None

    user = db.get(User, session.user_id)

    if user is None:
        db.rollback()
        return None

    access_token = create_access_token(user.id)

    db.commit()

    return AccessTokenResponse(
        access_token=access_token,
        expires_in=ACCESS_TOKEN_MINUTES * 60,
    )


def revoke_refresh_session(
    db: Session,
    refresh_token: str,
) -> None:
    session = find_refresh_session(db, refresh_token)

    if session is not None and session.revoked_at is None:
        session.revoked_at = datetime.now(timezone.utc)

    db.commit()