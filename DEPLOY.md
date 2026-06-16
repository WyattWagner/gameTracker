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

**Split deploy:** Host `apps/web/dist` on Netlify/Vercel/Cloudflare Pages and set `VITE_API_URL` + `CORS_ORIGIN`.

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
| `SEED_ON_START` | No | Set `true` on first deploy to seed `monster-hunter` game |

### Web (build time)

| Variable | When |
|----------|------|
| `VITE_API_URL` | Split hosting only, e.g. `https://api.example.com/api/v1` |

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
| `PORT` | `3001` |

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
2. Set `CORS_ORIGIN` to your frontend URL.
3. Build web with frontend env:

   ```powershell
   $env:VITE_API_URL = "https://your-api.onrender.com/api/v1"
   npm run build --workspace web
   ```

4. Deploy `apps/web/dist` to static hosting.

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
| `JWT_SECRET must be set in production` | Set a strong secret on the host |
| `Can't reach database` | Check `DATABASE_URL`, Postgres is running |
| Blank page after deploy | Set `WEB_DIST_PATH` or deploy web separately |
| API works, web CORS errors | Set `CORS_ORIGIN` to exact frontend URL |
| Uploads disappear | Mount persistent disk at `UPLOAD_DIR` |
