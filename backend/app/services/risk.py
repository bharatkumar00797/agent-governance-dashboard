"""
Simple rule-based risk scoring for agents.
In production this would incorporate more signals (permissions breadth,
data sensitivity, last activity, known vulnerabilities, etc.).
"""

from typing import List, Dict, Any

def calculate_risk_score(
    permissions: List[str] | None = None,
    data_access: List[str] | None = None,
    is_shadow: bool = False,
    agent_type: str = "custom",
    environment: str = "production",
) -> float:
    score = 0.0
    permissions = permissions or []
    data_access = data_access or []

    # Shadow agents start higher
    if is_shadow:
        score += 35.0

    # Broad or dangerous permissions
    high_risk_perms = {"write", "delete", "admin", "execute", "refund", "payment", "pii", "export"}
    for perm in permissions:
        if any(hr in perm.lower() for hr in high_risk_perms):
            score += 12.0
        else:
            score += 3.0

    # Sensitive data access
    sensitive = {"customer", "pii", "payment", "billing", "hr", "financial", "health"}
    for src in data_access:
        if any(s in src.lower() for s in sensitive):
            score += 15.0
        else:
            score += 4.0

    # Production environment increases risk surface
    if environment == "production":
        score += 10.0

    # Certain agent types are higher risk by nature
    if agent_type in ("support", "finance", "ops"):
        score += 8.0

    # Cap at 100
    return min(round(score, 1), 100.0)
