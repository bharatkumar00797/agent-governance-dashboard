"""
Seed the database with sample agents for demo purposes.
Run: python -m app.seed
"""

from app.database import SessionLocal, engine, Base
from app.models.agent import Agent
from app.services.risk import calculate_risk_score

def seed():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    # Clear existing for clean demo
    db.query(Agent).delete()

    samples = [
        {
            "name": "Refund Support Agent",
            "description": "Handles customer refund requests with deterministic workflows",
            "owner": "cx-team@company.com",
            "agent_type": "support",
            "status": "active",
            "permissions": ["read", "refund", "write"],
            "data_access": ["customer_db", "billing", "orders"],
            "framework": "LangGraph",
            "environment": "production",
            "is_shadow": False,
        },
        {
            "name": "Code Review Bot",
            "description": "Automated PR review and suggestions",
            "owner": "eng-platform@company.com",
            "agent_type": "coding",
            "status": "active",
            "permissions": ["read", "comment"],
            "data_access": ["github"],
            "framework": "custom",
            "environment": "production",
            "is_shadow": False,
        },
        {
            "name": "Shadow GPT Assistant",
            "description": "Employee using ChatGPT with company data (discovered)",
            "owner": "unknown",
            "agent_type": "custom",
            "status": "active",
            "permissions": ["read", "export"],
            "data_access": ["pii", "customer", "internal_docs"],
            "framework": None,
            "environment": "production",
            "is_shadow": True,
        },
        {
            "name": "Subscription Canceller",
            "description": "Processes subscription cancellations",
            "owner": "billing-team@company.com",
            "agent_type": "support",
            "status": "quarantined",
            "permissions": ["read", "cancel", "write"],
            "data_access": ["billing", "customer_db"],
            "framework": "LangGraph",
            "environment": "production",
            "is_shadow": False,
        },
        {
            "name": "Internal Ops Agent",
            "description": "Staging ops helper",
            "owner": "ops@company.com",
            "agent_type": "ops",
            "status": "active",
            "permissions": ["read"],
            "data_access": ["logs"],
            "framework": "CrewAI",
            "environment": "staging",
            "is_shadow": False,
        },
    ]

    for s in samples:
        risk = calculate_risk_score(
            permissions=s["permissions"],
            data_access=s["data_access"],
            is_shadow=s["is_shadow"],
            agent_type=s["agent_type"],
            environment=s["environment"],
        )
        agent = Agent(
            name=s["name"],
            description=s["description"],
            owner=s["owner"],
            agent_type=s["agent_type"],
            status=s["status"],
            risk_score=risk,
            permissions=s["permissions"],
            data_access=s["data_access"],
            framework=s["framework"],
            environment=s["environment"],
            is_shadow=s["is_shadow"],
        )
        db.add(agent)

    db.commit()
    print(f"Seeded {len(samples)} sample agents.")
    db.close()

if __name__ == "__main__":
    seed()
