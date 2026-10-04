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