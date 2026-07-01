# Deployment guide

Production checklist for **Game Tracker** (monorepo: Express API + React web + PostgreSQL).

## Architecture

| Component | Production |
|-----------|------------|
| API | Node 22, Express, port `3001` |
| Web | Vite static build (`apps/web/dist`) |
| Database | **PostgreSQL** in production; **SQLite** for local dev without Docker |

| Uploads | Local disk (`UPLOAD_DIR`) or mounted volume |

**Single-server deploy (recommended first):** API serves `/api/v1`, `/uploads`, and the built React app from one URL.

**Split deploy:** Host the web app on **Vercel** (recommended) or Netlify/Cloudflare Pages; run the API on Render/Railway/Fly with `CORS_ORIGIN` + `VITE_API_URL`.

---

## Deploy to Vercel (frontend)

Vercel hosts the **React static app only**. The Express API must run elsewhere (Render, Railway, or Fly) with PostgreSQL.

```
┌─────────────────────┐         ┌──────────────────────────────┐
│  Vercel             │  HTTPS  │  Render / Railway / Fly      │
│  apps/web/dist      │ ──────► │  Express API + PostgreSQL    │
│  React SPA          │         │  /api/v1, /uploads (volume)  │
└─────────────────────┘         └──────────────────────────────┘
```

### 1. Deploy the API first

Follow [Deploy to Render](#deploy-to-render) or [Deploy to Railway](#deploy-to-railway), but **omit** `WEB_DIST_PATH` so the API does not serve the frontend.

Set on the API host:

| Variable | Example |
|----------|---------|
| `CORS_ORIGIN` | `https://your-app.vercel.app` |
| `CORS_ALLOW_VERCEL_PREVIEWS` | `true` (allows `*.vercel.app` preview URLs) |

### 2. Import repo to Vercel

1. [vercel.com](https://vercel.com) → **Add New → Project** → import your GitHub repo.
2. Vercel reads root **`vercel.json`** — no extra framework preset needed.
3. **Build command:** `npm run build:vercel` (default from `vercel.json`)
4. **Output directory:** `apps/web/dist`

### 3. Vercel environment variables (Project → Settings → Environment Variables)

| Variable | Value | Environments |
|----------|-------|--------------|
| `VITE_API_URL` | `https://your-api.onrender.com/api/v1` | Production, Preview, Development |

`VITE_API_ORIGIN` is optional; it is inferred from `VITE_API_URL` for monster upload images (`/uploads/...`).

### 4. Deploy

Push to GitHub — Vercel builds and deploys automatically.

Open your `*.vercel.app` URL → register → use the app.

### Local Vercel-style build

```powershell
$env:VITE_API_URL = "http://localhost:3001/api/v1"
npm run build:vercel
npx serve apps/web/dist
```

### Why not API on Vercel?

The API uses a long-running Express server, Prisma + PostgreSQL, and disk uploads (multer). Vercel serverless functions have ephemeral storage and request timeouts — use Render/Railway for the API unless you migrate uploads to blob storage and refactor to serverless handlers.

---

## Environment variables

### API (`apps/api/.env`)

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `JWT_SECRET` | Yes in prod | Long random string (not `dev-secret-change-me`) |
| `PORT` | No | Default `3001` |
| `NODE_ENV` | Prod | Set to `production` |
| `WEB_DIST_PATH` | Single-server | Path to `apps/web/dist` |
| `UPLOAD_DIR` | No | Upload root (default `uploads`) |
| `CORS_ORIGIN` | Split deploy | Comma-separated frontend URLs |
| `CORS_ALLOW_VERCEL_PREVIEWS` | Split + Vercel | Set `true` to allow `*.vercel.app` preview origins |
| `SEED_ON_START` | No | Set `true` on first deploy to seed `monster-hunter` game |

Do **not** set `PORT` on Railway — the platform injects it automatically.

### Web (build time)

| Variable | When |
|----------|------|
| `VITE_API_URL` | Split hosting only, e.g. `https://api.example.com/api/v1` |
| `VITE_API_ORIGIN` | Optional; API origin for `/uploads` (auto-derived from `VITE_API_URL`) |

Leave unset for same-origin deploy (Docker / Render single service).

---

## Local production smoke test

```powershell
# 1. Start PostgreSQL
docker compose up -d postgres

# 2. Copy env if needed
copy apps\api\.env.example apps\api\.env

# 3. Build everything
npm run build:prod

# 4. Run production server (serves API + web)
npm run start:prod
```

Open http://localhost:3001

Full stack in Docker:

```powershell
$env:JWT_SECRET = "local-prod-secret-at-least-32-chars"
docker compose --profile production up --build
```

---

## Deploy to Render

1. Push this repo to GitHub.
2. In Render: **New → Blueprint** and connect the repo (`render.yaml` is included).
3. Render creates:
   - PostgreSQL database
   - Web service (Docker) with persistent disk for uploads
4. First deploy runs migrations via `scripts/start-production.sh`.
5. Open the Render URL — register a user and use the app.

To redeploy after changes: push to GitHub; Render rebuilds automatically.

---

## Deploy to Railway

Railway uses your existing **`Dockerfile`** and **`railway.toml`**. Best for a single URL (API + built web app).

### 1. Connect GitHub

1. Sign up at [railway.com](https://railway.com) with GitHub.
2. **New Project → Deploy from GitHub repo** → select **`WyattWagner/gameTracker`**.
3. If the private repo is missing: GitHub → Settings → Applications → Railway → grant access to **gameTracker**.

### 2. Add PostgreSQL

1. In the project: **+ New → Database → PostgreSQL**.
2. Open the Postgres service → **Connect** → copy **`DATABASE_URL`**.

### 3. Configure the web service

Select your app service → **Variables**:

| Variable | Value |
|----------|--------|
| `NODE_ENV` | `production` |
| `DATABASE_URL` | `${{Postgres.DATABASE_URL}}` (Railway reference) or paste connection string |
| `JWT_SECRET` | long random string |
| `WEB_DIST_PATH` | `/app/apps/web/dist` |
| `UPLOAD_DIR` | `/app/apps/api/uploads` |
| `SEED_ON_START` | `true` (first deploy only) |

Do **not** set `PORT` — Railway injects it.

### 4. Persistent uploads (recommended)

1. Service → **Volumes** → **Add volume**
2. Mount path: `/app/apps/api/uploads`

Without a volume, monster image uploads are lost on redeploy.

### 5. Deploy

Railway builds from `Dockerfile`, runs `scripts/start-production.sh` (migrations + start).

Open the generated **`.railway.app`** URL → register → add monsters from the catalog.

### Railway pricing note

New accounts get trial credits (~$5). Ongoing hosting is typically **~$5/month** (Hobby) for API + Postgres — not permanently free, but simple to use.

---

## Split frontend + API

1. Deploy API (Render/Railway/Fly) with **only** API env vars (no `WEB_DIST_PATH`).
2. Set `CORS_ORIGIN` to your Vercel URL; set `CORS_ALLOW_VERCEL_PREVIEWS=true` for preview deploys.
3. On Vercel, set `VITE_API_URL` (see [Deploy to Vercel](#deploy-to-vercel-frontend)).
4. Or build locally:

   ```powershell
   $env:VITE_API_URL = "https://your-api.onrender.com/api/v1"
   npm run build:vercel
   ```

5. Deploy `apps/web/dist` to Vercel (or `npm run build:vercel` via Git integration).

---

## Build commands (CI / host)

```powershell
npm ci
npm run build:prod
cd apps/api
npx prisma migrate deploy
node dist/index.js
```

Or use `npm run start:prod` from the repo root (runs migrate + start).

---

## Security notes

- Rotate `JWT_SECRET` if it was ever committed or shared.
- Use HTTPS in production (Render provides this).
- Monster images on disk require a **persistent volume**; ephemeral containers lose uploads on redeploy without one.

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Health check fails / service unavailable | Check deploy logs. Common causes: missing `DATABASE_URL` or `JWT_SECRET`, or DB migrations failing (see below) |
| `JWT_SECRET must be set in production` | Set a strong secret on the host |
| `DATABASE_URL is not set` | Add PostgreSQL and reference `${{Postgres.DATABASE_URL}}` on Railway |
| Migration provider mismatch (sqlite vs postgresql) | Fixed in Docker: production image uses `migrations-postgres/` — redeploy latest |
| `Can't reach database` | Check `DATABASE_URL`, Postgres is running |
| Blank page after deploy | Set `WEB_DIST_PATH` or deploy web separately |
| API works, web CORS errors | Set `CORS_ORIGIN` to exact frontend URL; use `CORS_ALLOW_VERCEL_PREVIEWS=true` for Vercel previews |
| Monster images broken on Vercel | Set `VITE_API_URL`; upload paths resolve via API origin |
| Uploads disappear | Mount persistent disk at `UPLOAD_DIR` |
