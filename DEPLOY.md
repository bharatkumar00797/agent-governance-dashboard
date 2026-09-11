# Deployment Guide

## Backend → Railway

1. Go to [railway.app](https://railway.app) and sign in with GitHub.
2. **New Project** → **Deploy from GitHub repo** → select `agent-governance-dashboard`.
3. Add a **PostgreSQL** plugin (Railway will give you `DATABASE_URL`).
4. Set the service root directory to `backend` (or use the Dockerfile).
5. Set start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
6. Deploy. Copy the public URL.

## Frontend → Vercel

1. Go to [vercel.com](https://vercel.com) and import the same GitHub repo.
2. Set **Root Directory** to `frontend`.
3. Add environment variable:
   - `NEXT_PUBLIC_API_URL` = your Railway backend URL (no trailing slash)
4. Deploy.

## Local testing reminder

```bash
# Backend
cd backend && uvicorn app.main:app --reload --port 8000

# Frontend
cd frontend && npm install && npm run dev
```
