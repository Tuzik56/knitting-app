from sqlalchemy import select
from sqlalchemy.orm import Session

from .models import User
from .schemas import UserRegister
from .security import hash_password


def get_user_by_username(db: Session, username: str):
    return db.scalar(
        select(User).where(User.username == username)
    )


def create_user(db: Session, data: UserRegister):
    user = User(
        username=data.username,
        password_hash=hash_password(data.password),
    )

    db.add(user)
    db.commit()
    db.refresh(user)
    return user