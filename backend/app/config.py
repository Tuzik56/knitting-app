import os
from pathlib import Path

from dotenv import load_dotenv
from sqlalchemy import URL

load_dotenv(Path(__file__).resolve().parent.parent / ".env")

url = URL.create(
    drivername="postgresql+psycopg",
    username=os.environ["DB_USER"],
    password=os.environ["DB_PASSWORD"],
    host=os.environ["DB_HOST"],
    port=int(os.environ["DB_PORT"]),
    database=os.environ["DB_NAME"],
)

JWT_SECRET = os.environ["JWT_SECRET"]
JWT_ALGORITHM = "HS256"

ACCESS_TOKEN_MINUTES = int(os.getenv("ACCESS_TOKEN_MINUTES", "15"))
REFRESH_TOKEN_DAYS = int(os.getenv("REFRESH_TOKEN_DAYS", "7"))

if JWT_SECRET == "replace_with_generated_secret" or len(JWT_SECRET) < 32:
    raise ValueError("Задайте сгенерированный JWT_SECRET в .env")

if ACCESS_TOKEN_MINUTES <= 0 or REFRESH_TOKEN_DAYS <= 0:
    raise ValueError("Сроки действия токенов должны быть положительными")