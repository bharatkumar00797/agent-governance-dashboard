from pydantic import BaseModel, Field, ConfigDict
from typing import Optional, List, Dict, Any
from datetime import datetime

class AgentBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = None
    owner: str = Field(..., min_length=1, max_length=255)
    agent_type: str = Field(default="custom", max_length=100)
    status: str = Field(default="active", max_length=50)
    permissions: List[str] = Field(default_factory=list)
    data_access: List[str] = Field(default_factory=list)
    framework: Optional[str] = None
    environment: str = Field(default="production", max_length=50)
    is_shadow: bool = False
    metadata: Dict[str, Any] = Field(default_factory=dict)

class AgentCreate(AgentBase):
    pass

class AgentUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = None
    owner: Optional[str] = Field(None, min_length=1, max_length=255)
    agent_type: Optional[str] = None
    status: Optional[str] = None
    permissions: Optional[List[str]] = None
    data_access: Optional[List[str]] = None
    framework: Optional[str] = None
    environment: Optional[str] = None
    is_shadow: Optional[bool] = None
    metadata: Optional[Dict[str, Any]] = None

class AgentResponse(AgentBase):
    id: int
    risk_score: float
    last_seen: datetime
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)

class AgentListResponse(BaseModel):
    total: int
    agents: List[AgentResponse]
