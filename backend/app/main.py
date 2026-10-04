from fastapi import FastAPI

from .routes_projects import router as projects_router
from .routes_yarns import router as yarns_router

app = FastAPI(title="Knitting API")

app.include_router(yarns_router)
app.include_router(projects_router)