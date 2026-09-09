from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="Agent Governance Dashboard API",
    description="Central inventory and control plane for AI agents",
    version="0.1.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # tighten in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "Agent Governance Dashboard API is running", "version": "0.1.0"}

@app.get("/health")
def health():
    return {"status": "healthy"}

# Placeholder for future routers
# from app.routers import agents, audit
# app.include_router(agents.router, prefix="/api/v1/agents", tags=["agents"])
