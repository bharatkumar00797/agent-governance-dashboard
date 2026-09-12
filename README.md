# Agent Inventory & Governance Dashboard

Central platform for enterprises to **discover, monitor, and control** all AI agents running across the organization.

## Features
- Full Agent Registry (CRUD)
- Rule-based **risk scoring**
- Status management (active / quarantined / inactive / draft)
- Shadow agent detection flag
- Filters by status, type, risk
- Clean modern dashboard UI
- Auto-seeds sample data on first run

## Tech Stack
- **Frontend**: Next.js 15 + TypeScript + Tailwind CSS
- **Backend**: FastAPI + SQLAlchemy + Pydantic
- **Database**: SQLite (local) / PostgreSQL (production)

## Quick Start (Local)

### Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate          # Windows: venv\\Scripts\\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```
On first start it will automatically create 5 sample agents.

API docs → http://localhost:8000/docs

### Frontend
```bash
cd frontend
npm install
npm run dev
```
Dashboard → http://localhost:3000

## Deploy
See [DEPLOY.md](./DEPLOY.md) for Railway (backend) + Vercel (frontend) steps.

## Project Status
| Area              | Status      |
|-------------------|-------------|
| Backend API       | ✅ Complete |
| Risk scoring      | ✅ Complete |
| Frontend UI       | ✅ Complete |
| Sample data       | ✅ Auto-seed|
| Deployment ready  | ✅ Yes      |

Built with Grok.
