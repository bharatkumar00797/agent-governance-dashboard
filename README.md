# Agent Inventory & Governance Dashboard

Central platform for enterprises to **discover, monitor, and control** all AI agents running across the organization.

## Why this exists
As companies deploy multiple AI agents, visibility into what is running, what data they access, and compliance posture is lost. This dashboard acts as the "IT dashboard for AI agents".

## Features (MVP Roadmap)
- Agent Registry / Inventory
- Ownership & metadata
- Risk scoring
- Basic policy flags
- Audit log viewer
- Simple discovery API

## Tech Stack
- **Frontend**: Next.js 15 + TypeScript + Tailwind CSS + shadcn/ui
- **Backend**: FastAPI (Python)
- **Database**: PostgreSQL
- **Hosting**: Vercel (frontend) + Railway (backend + DB)
- **Observability**: LangSmith / OpenTelemetry ready

## Project Structure
```
agent-governance-dashboard/
├── backend/                 # FastAPI application
│   ├── app/
│   │   ├── main.py
│   │   ├── models/
│   │   ├── routers/
│   │   └── services/
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/                # Next.js application
│   ├── app/
│   ├── components/
│   ├── lib/
│   └── package.json
├── docker-compose.yml
├── .github/
└── README.md
```

## Quick Start (Local)

### Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## Status
Day 1 scaffold complete. See GitHub Issues for the weekly roadmap.

Built with help from Grok.
