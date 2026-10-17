from fastapi import FastAPI

from .routes_auth import router as auth_router
from .routes_projects import router as projects_router
from .routes_yarns import router as yarns_router
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Knitting API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["Authorization", "Content-Type"],
)

app.include_router(auth_router)
app.include_router(yarns_router)
app.include_router(projects_router)