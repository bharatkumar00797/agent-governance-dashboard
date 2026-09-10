# Agent Inventory & Governance Dashboard

Central platform for enterprises to **discover, monitor, and control** all AI agents running across the organization.

## Features (Current)
- Agent Registry / Inventory with full CRUD
- Risk scoring (rule-based)
- Status management (active / quarantined / inactive)
- Shadow agent flagging
- Filters by status, type, risk level
- Clean Next.js dashboard UI

## Tech Stack
- **Frontend**: Next.js 15 + TypeScript + Tailwind CSS
- **Backend**: FastAPI + SQLAlchemy + Pydantic
- **Database**: SQLite (local) / PostgreSQL (production)

## Quick Start

### 1. Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate   # or venv\\Scripts\\activate on Windows
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```
API docs: http://localhost:8000/docs

### 2. Frontend
```bash
cd frontend
npm install
npm run dev
```
Dashboard: http://localhost:3000

Set `NEXT_PUBLIC_API_URL=http://localhost:8000` if needed.

## API Endpoints
| Method | Path | Description |
|--------|------|-------------|
| POST | /api/v1/agents | Register agent |
| GET | /api/v1/agents | List + filters |
| GET | /api/v1/agents/{id} | Get one |
| PATCH | /api/v1/agents/{id} | Update |
| DELETE | /api/v1/agents/{id} | Delete |
| POST | /api/v1/agents/{id}/quarantine | Quarantine |
| POST | /api/v1/agents/{id}/activate | Activate |

## Status
Day 1–3 complete. Backend + full frontend ready for local testing and deployment.

Built with Grok.
