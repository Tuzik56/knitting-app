from typing import Literal
from pydantic import BaseModel, ConfigDict, Field, field_validator


class YarnWrite(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)

    name: str = Field(min_length=1, max_length=200)
    brand: str = Field(min_length=1, max_length=200)
    composition: str = Field(min_length=1, max_length=300)
    color: str = Field(min_length=1, max_length=50)
    weight: int = Field(gt=0)
    length: int = Field(gt=0)
    quantity: int = Field(ge=0)
    notes: str = ""


class YarnRead(YarnWrite):
    model_config = ConfigDict(
        from_attributes=True,
        str_strip_whitespace=True,
    )

    id: int


class ProjectWrite(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)

    name: str = Field(min_length=1, max_length=200)
    description: str = ""
    status: Literal["В планах", "В процессе", "Завершен"] = "В планах"
    progress: int = Field(default=0, ge=0, le=100)
    yarnIds: list[int] = Field(default_factory=list)
    notes: str = ""

    @field_validator("yarnIds")
    @classmethod
    def validate_yarn_ids(cls, values: list[int]):
        if any(value <= 0 for value in values):
            raise ValueError("ID пряжи должны быть положительными")

        if len(values) != len(set(values)):
            raise ValueError("Одна и та же пряжа указана несколько раз")

        return values


class ProjectRead(ProjectWrite):
    id: int


class UserRegister(BaseModel):
    username: str = Field(min_length=3, max_length=50)
    password: str = Field(min_length=8, max_length=128)

    @field_validator("username", mode="before")
    @classmethod
    def normalize_username(cls, value):
        if isinstance(value, str):
            return value.strip().lower()
        return value

    @field_validator("username")
    @classmethod
    def validate_username(cls, value: str):
        allowed = "abcdefghijklmnopqrstuvwxyz0123456789_-"

        if any(character not in allowed for character in value):
            raise ValueError(
                "Логин может содержать только латинские буквы, "
                "цифры, дефис и подчёркивание"
            )

        return value

    @field_validator("password")
    @classmethod
    def validate_password(cls, value: str):
        if not value.strip():
            raise ValueError("Пароль не может состоять только из пробелов")

        return value


class UserRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    username: str


class UserLogin(BaseModel):
    username: str = Field(min_length=1, max_length=50)
    password: str = Field(min_length=1, max_length=128)

    @field_validator("username", mode="before")
    @classmethod
    def normalize_username(cls, value):
        if isinstance(value, str):
            return value.strip().lower()
        return value


class TokenPair(BaseModel):
    access_token: str
    refresh_token: str
    token_type: Literal["bearer"] = "bearer"
    expires_in: int


class RefreshTokenRequest(BaseModel):
    refresh_token: str = Field(min_length=1, max_length=512)


class AccessTokenResponse(BaseModel):
    access_token: str
    token_type: Literal["bearer"] = "bearer"
    expires_in: int