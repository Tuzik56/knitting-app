import hashlib
import secrets
from datetime import datetime, timedelta, timezone

import jwt
from pwdlib import PasswordHash
from jwt.exceptions import InvalidTokenError

from .config import (
    ACCESS_TOKEN_MINUTES,
    JWT_ALGORITHM,
    JWT_SECRET,
)

password_hasher = PasswordHash.recommended()

DUMMY_PASSWORD_HASH = password_hasher.hash(
    "not-a-real-user-password"
)


def hash_password(password: str) -> str:
    return password_hasher.hash(password)


def verify_password(password: str, password_hash: str) -> bool:
    return password_hasher.verify(password, password_hash)


def create_access_token(user_id: int) -> str:
    now = datetime.now(timezone.utc)

    payload = {
        "sub": str(user_id),
        "type": "access",
        "iat": now,
        "exp": now + timedelta(minutes=ACCESS_TOKEN_MINUTES),
        "jti": secrets.token_hex(16),
    }

    return jwt.encode(
        payload,
        JWT_SECRET,
        algorithm=JWT_ALGORITHM,
    )


def create_refresh_token() -> str:
    return secrets.token_urlsafe(32)


def hash_refresh_token(token: str) -> str:
    return hashlib.sha256(token.encode("utf-8")).hexdigest()

def get_user_id_from_access_token(token: str) -> int:
    payload = jwt.decode(
        token,
        JWT_SECRET,
        algorithms=[JWT_ALGORITHM],
        options={
            "require": ["sub", "type", "iat", "exp", "jti"],
        },
    )

    if payload["type"] != "access":
        raise InvalidTokenError("Неверный тип токена")

    subject = payload["sub"]

    if (
        not isinstance(subject, str)
        or not subject.isascii()
        or not subject.isdecimal()
        or len(subject) > 10
    ):
        raise InvalidTokenError("Некорректный ID пользователя")

    user_id = int(subject)

    if not 1 <= user_id <= 2_147_483_647:
        raise InvalidTokenError("Некорректный ID пользователя")

    return user_id