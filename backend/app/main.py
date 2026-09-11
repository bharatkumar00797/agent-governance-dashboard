from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.database import engine, Base
from app.routers import agents_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Create tables on startup (for MVP / SQLite). Use Alembic in production.
    Base.metadata.create_all(bind=engine)
    yield

app = FastAPI(
    title="Agent Governance Dashboard API",
    description="Central inventory and control plane for AI agents",
    version="0.2.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # tighten in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(agents_router, prefix="/api/v1/agents", tags=["agents"])

@app.get("/")
def root():
    return {
        "message": "Agent Governance Dashboard API is running",
        "version": "0.2.0",
        "docs": "/docs"
    }

@app.get("/health")
def health():
    return {"status": "healthy"}

@app.post("/seed")
def seed_endpoint():
    """Convenience endpoint to load sample data (dev only)."""
    from app.seed import seed
    seed()
    return {"message": "Sample agents seeded"}
