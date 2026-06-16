# Game Tracker (TDD Monorepo)

Track Monster Hunter progress: quests, hunts, captures, drops, and dashboard stats.

## Stack

- **Frontend:** React + TypeScript + TailwindCSS + Vitest
- **Backend:** Node.js + Express + Jest + Supertest
- **Database:** PostgreSQL + Prisma
- **Shared contracts:** Zod schemas in `packages/shared`
- **Domain logic:** `packages/domain` (pure stats/use-case helpers)
- **UI library:** `packages/ui`

## Setup

Requires **Docker Desktop** only if you want local PostgreSQL. By default, local dev uses **SQLite** (`apps/api/prisma/dev.db`) — no Docker needed.

```powershell
npm install
copy apps\api\.env.example apps\api\.env
npm run fix:dev
```

## Development

Run **both** servers. The web app proxies `/api` to port 3001.

```powershell
# One-time or after pull
npm.cmd run fix:dev

# Terminal 1 — API
npm.cmd run dev:api

# Terminal 2 — Web UI
npm.cmd run dev:web
```

- Web: http://localhost:5173
- API health: http://localhost:3001/health
- API: http://localhost:3001/api/v1

### Troubleshooting

| Symptom | Fix |
|--------|-----|
| Vite `proxy error` / `ECONNREFUSED` on `/api` | Start `npm run dev:api` in a second terminal |
| `EADDRINUSE` on port 3001 | Only one API instance; run `npm run fix:dev` or close the other terminal |
| `Can't reach database server` | Run `npm run docker:up` or `npm run fix:dev` |
| `Foreign key` when adding monsters | Run `npm run fix:dev` or `npm run db:seed` |
| `Cannot find module '@game-tracker/domain/dist'` | Run `npm run build:packages` or `npm run fix:dev` |

## Testing

```powershell
npm run docker:up
npm test
npm run test:e2e
```

## Production / hosting

See **[DEPLOY.md](./DEPLOY.md)** for Render, **Railway**, Docker, and env vars.

Monster reference data: **[MONSTER_CATALOG.md](./MONSTER_CATALOG.md)** (58 MHW monsters).

Quick local production smoke test:

```powershell
npm run build:prod
npm run start:prod
```

Open http://localhost:3001 (API serves the built web app).

## Backup push

```powershell
.\git-all-push "your commit message"
```

## Architecture notes

- Game modules live in `apps/api/src/games/` and `packages/ui/src/games/`
- API routes are protected with JWT (`Authorization: Bearer <token>`)
- Dashboard stats are computed in `packages/domain` from monster counters
- Monster images stored under `UPLOAD_DIR` (persistent volume in production)

## Future expansion

- Additional games via game registry
- Auth already in place for multi-user data scoping
- `metadata` JSON fields on models for game-specific extensions
- Optional split hosting: static web + API with `VITE_API_URL` and `CORS_ORIGIN`
