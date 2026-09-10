from sqlalchemy import Column, Integer, String, Float, DateTime, Text, JSON, Boolean
from sqlalchemy.sql import func
from app.database import Base

class Agent(Base):
    __tablename__ = "agents"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False, index=True)
    description = Column(Text, nullable=True)
    owner = Column(String(255), nullable=False, index=True)
    agent_type = Column(String(100), nullable=False, default="custom")  # custom, support, coding, etc.
    status = Column(String(50), nullable=False, default="active")  # active, inactive, quarantined, draft
    risk_score = Column(Float, default=0.0)
    permissions = Column(JSON, default=list)  # list of permissions / tools
    data_access = Column(JSON, default=list)  # systems / data sources it can reach
    framework = Column(String(100), nullable=True)  # LangGraph, CrewAI, etc.
    environment = Column(String(50), default="production")  # production, staging, dev
    last_seen = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    is_shadow = Column(Boolean, default=False)  # discovered without formal registration
    metadata_ = Column("metadata", JSON, default=dict)  # flexible extra fields

    def __repr__(self):
        return f"<Agent(id={self.id}, name='{self.name}', owner='{self.owner}')>"
