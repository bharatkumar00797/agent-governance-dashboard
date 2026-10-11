from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Optional, List

from app.database import get_db
from app.models.agent import Agent
from app.schemas.agent import AgentCreate, AgentUpdate, AgentResponse, AgentListResponse
from app.services.risk import calculate_risk_score

router = APIRouter()

@router.post("", response_model=AgentResponse, status_code=201)
@router.post("/", response_model=AgentResponse, status_code=201, include_in_schema=False)
def register_agent(agent_in: AgentCreate, db: Session = Depends(get_db)):
    """Register a new AI agent in the inventory."""
    risk = calculate_risk_score(
        permissions=agent_in.permissions,
        data_access=agent_in.data_access,
        is_shadow=agent_in.is_shadow,
        agent_type=agent_in.agent_type,
        environment=agent_in.environment,
    )

    db_agent = Agent(
        name=agent_in.name,
        description=agent_in.description,
        owner=agent_in.owner,
        agent_type=agent_in.agent_type,
        status=agent_in.status,
        risk_score=risk,
        permissions=agent_in.permissions,
        data_access=agent_in.data_access,
        framework=agent_in.framework,
        environment=agent_in.environment,
        is_shadow=agent_in.is_shadow,
        metadata_=agent_in.metadata,
    )
    db.add(db_agent)
    db.commit()
    db.refresh(db_agent)
    return db_agent

@router.get("", response_model=AgentListResponse)
@router.get("/", response_model=AgentListResponse, include_in_schema=False)
def list_agents(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=200),
    owner: Optional[str] = None,
    status: Optional[str] = None,
    agent_type: Optional[str] = None,
    environment: Optional[str] = None,
    is_shadow: Optional[bool] = None,
    min_risk: Optional[float] = None,
    db: Session = Depends(get_db),
):
    """List agents with optional filters."""
    query = db.query(Agent)

    if owner:
        query = query.filter(Agent.owner == owner)
    if status:
        query = query.filter(Agent.status == status)
    if agent_type:
        query = query.filter(Agent.agent_type == agent_type)
    if environment:
        query = query.filter(Agent.environment == environment)
    if is_shadow is not None:
        query = query.filter(Agent.is_shadow == is_shadow)
    if min_risk is not None:
        query = query.filter(Agent.risk_score >= min_risk)

    total = query.count()
    agents = query.order_by(Agent.risk_score.desc()).offset(skip).limit(limit).all()

    return AgentListResponse(total=total, agents=agents)

@router.get("/{agent_id}", response_model=AgentResponse)
def get_agent(agent_id: int, db: Session = Depends(get_db)):
    """Get a single agent by ID."""
    agent = db.query(Agent).filter(Agent.id == agent_id).first()
    if not agent:
        raise HTTPException(status_code=404, detail="Agent not found")
    return agent

@router.patch("/{agent_id}", response_model=AgentResponse)
def update_agent(agent_id: int, agent_in: AgentUpdate, db: Session = Depends(get_db)):
    """Update an existing agent. Risk score is recalculated if relevant fields change."""
    agent = db.query(Agent).filter(Agent.id == agent_id).first()
    if not agent:
        raise HTTPException(status_code=404, detail="Agent not found")

    update_data = agent_in.model_dump(exclude_unset=True)

    # Map metadata key correctly
    if "metadata" in update_data:
        update_data["metadata_"] = update_data.pop("metadata")

    for field, value in update_data.items():
        setattr(agent, field, value)

    # Recalculate risk if any scoring inputs changed
    scoring_fields = {"permissions", "data_access", "is_shadow", "agent_type", "environment"}
    if scoring_fields.intersection(update_data.keys()):
        agent.risk_score = calculate_risk_score(
            permissions=agent.permissions,
            data_access=agent.data_access,
            is_shadow=agent.is_shadow,
            agent_type=agent.agent_type,
            environment=agent.environment,
        )

    db.commit()
    db.refresh(agent)
    return agent

@router.delete("/{agent_id}", status_code=204)
def delete_agent(agent_id: int, db: Session = Depends(get_db)):
    """Remove an agent from the inventory."""
    agent = db.query(Agent).filter(Agent.id == agent_id).first()
    if not agent:
        raise HTTPException(status_code=404, detail="Agent not found")
    db.delete(agent)
    db.commit()
    return None

@router.post("/{agent_id}/quarantine", response_model=AgentResponse)
def quarantine_agent(agent_id: int, db: Session = Depends(get_db)):
    """Quick action: set status to quarantined."""
    agent = db.query(Agent).filter(Agent.id == agent_id).first()
    if not agent:
        raise HTTPException(status_code=404, detail="Agent not found")
    agent.status = "quarantined"
    db.commit()
    db.refresh(agent)
    return agent

@router.post("/{agent_id}/activate", response_model=AgentResponse)
def activate_agent(agent_id: int, db: Session = Depends(get_db)):
    """Quick action: set status back to active."""
    agent = db.query(Agent).filter(Agent.id == agent_id).first()
    if not agent:
        raise HTTPException(status_code=404, detail="Agent not found")
    agent.status = "active"
    db.commit()
    db.refresh(agent)
    return agent
