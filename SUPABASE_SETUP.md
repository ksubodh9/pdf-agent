# Supabase Setup Guide

This guide walks you through creating a Supabase project, applying the schema, and wiring the credentials into the PDF Agent backend.

---

## 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in.
2. Click **New project**.
3. Fill in the project name, database password, and region. Save the password somewhere safe.
4. Wait ~2 minutes for provisioning to complete.

---

## 2. Apply the Schema

1. In your project dashboard, go to **SQL Editor** → **New query**.
2. Open `pdf-agent/supabase/schema.sql` from this repo.
3. Paste the full contents and click **Run**.

This creates the `documents`, `chat_messages`, and `usage_events` tables with Row Level Security already enabled.

---

## 3. Collect Your Credentials

Go to **Project Settings → API** and note:

| Value | Where to find it |
|---|---|
| `SUPABASE_URL` | "Project URL" (e.g. `https://xyzabc.supabase.co`) |
| `SUPABASE_ANON_KEY` | "anon / public" key — used in the React frontend |
| `SUPABASE_JWT_SECRET` | "JWT Secret" — used by the FastAPI backend to verify tokens |
| `SUPABASE_SERVICE_ROLE_KEY` | "service_role" key — used by admin endpoints only, **never expose to the browser** |

---

## 4. Configure the Backend (.env)

Create `pdf-agent/.env` (copy from `pdf-agent/.env.example`):

```env
# Supabase
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_JWT_SECRET=your-jwt-secret-from-dashboard
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Switch to PostgreSQL
DATABASE_URL=postgresql://postgres:[your-db-password]@db.your-project-ref.supabase.co:5432/postgres

# Your LLM key (e.g. Gemini)
GEMINI_API_KEY=your-gemini-api-key
LLM_PROVIDER=gemini

# Production frontend URL (used for CORS)
FRONTEND_URL=https://your-app.vercel.app
```

The `DATABASE_URL` can also be found in **Project Settings → Database → Connection string → URI**.

---

## 5. Configure the Frontend (.env)

Create `pdf-agent/frontend/.env` (copy from `pdf-agent/frontend/.env.example`):

```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_API_BASE=https://your-backend.onrender.com
```

---

## 6. Grant Yourself Admin Access

After signing up via the app, run this in the Supabase SQL Editor (replace with your user UUID from **Authentication → Users**):

```sql
SELECT grant_admin('your-user-uuid-here');
```

Your JWT will now contain `app_metadata.role = "admin"`, unlocking the `/admin` dashboard.

---

## 7. Run Locally with Supabase

Once the `.env` files are in place:

```bash
# Backend
cd pdf-agent
pip install -r requirements.txt
uvicorn app.main:app --reload

# Frontend
cd pdf-agent/frontend
npm install
npm run dev
```

Open http://localhost:5173. Sign up, then use the app. The backend uses Supabase PostgreSQL for storage while ChromaDB stays local.

---

## 8. Deploy

See `render.yaml` for the backend (Render) and `vercel.json` for the frontend (Vercel) configurations.

**Render environment variables** — set these in the Render dashboard (or they'll be read from `render.yaml`):
- `DATABASE_URL`
- `SUPABASE_URL`
- `SUPABASE_JWT_SECRET`
- `SUPABASE_SERVICE_ROLE_KEY`
- `GEMINI_API_KEY`
- `FRONTEND_URL`

**Vercel environment variables** — set in the Vercel dashboard:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_API_BASE`
