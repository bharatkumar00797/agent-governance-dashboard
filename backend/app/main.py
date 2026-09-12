from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.database import engine, Base, SessionLocal
from app.models.agent import Agent
from app.routers import agents_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Create tables on startup
    Base.metadata.create_all(bind=engine)

    # Auto-seed if the inventory is empty (great for first-run demo)
    db = SessionLocal()
    try:
        count = db.query(Agent).count()
        if count == 0:
            from app.seed import seed
            seed()
            print("→ Auto-seeded sample agents (first run)")
    finally:
        db.close()

    yield

app = FastAPI(
    title="Agent Governance Dashboard API",
    description="Central inventory and control plane for AI agents",
    version="0.2.1",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(agents_router, prefix="/api/v1/agents", tags=["agents"])

@app.get("/")
def root():
    return {
        "message": "Agent Governance Dashboard API is running",
        "version": "0.2.1",
        "docs": "/docs"
    }

@app.get("/health")
def health():
    return {"status": "healthy"}

@app.post("/seed")
def seed_endpoint():
    """Force re-seed sample data (dev only)."""
    from app.seed import seed
    seed()
    return {"message": "Sample agents seeded"}
