from fastapi import Depends, HTTPException
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jwt.exceptions import InvalidTokenError
from sqlalchemy.orm import Session

from .database import get_db
from .models import User
from .security import get_user_id_from_access_token

bearer_scheme = HTTPBearer(auto_error=False)


def get_current_user(
    credentials: HTTPAuthorizationCredentials | None = Depends(
        bearer_scheme
    ),
    db: Session = Depends(get_db),
) -> User:
    unauthorized = HTTPException(
        status_code=401,
        detail="Требуется вход: access-токен отсутствует или недействителен",
        headers={"WWW-Authenticate": "Bearer"},
    )

    if credentials is None:
        raise unauthorized

    try:
        user_id = get_user_id_from_access_token(
            credentials.credentials
        )
    except InvalidTokenError:
        raise unauthorized from None

    user = db.get(User, user_id)

    if user is None:
        raise unauthorized

    return user