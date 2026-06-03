# Game Tracker (TDD Monorepo)

Track Monster Hunter progress: quests, hunts, captures, drops, and dashboard stats.

## Stack

- **Frontend:** React + TypeScript + TailwindCSS + Vitest
- **Backend:** Node.js + Express + Jest + Supertest
- **Database:** SQLite + Prisma
- **Shared contracts:** Zod schemas in `packages/shared`
- **Domain logic:** `packages/domain` (pure stats/use-case helpers)
- **UI library:** `packages/ui`

## Setup

```powershell
npm install
npm run db:migrate
npm run db:seed
```

## Development

Run **both** servers. The web app proxies `/api` to port 3001.

```powershell
# One-time or after pull (install, build packages, migrate, seed)
npm.cmd run fix:dev

# Terminal 1 — API (must show: API listening on http://localhost:3001)
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
| `Foreign key` when adding monsters | Run `npm run fix:dev` or `npm run db:seed` (ensures `monster-hunter` game exists) |
| `Cannot find module '@game-tracker/domain/dist'` | Run `npm run build:packages` or `npm run fix:dev` |

## Testing

```powershell
npm test
npm run test:e2e
```

## Backup push

```powershell
.\git-all-push "your commit message"
```

## Architecture notes

- Game modules live in `apps/api/src/games/` and `packages/ui/src/games/`
- API routes are protected with JWT (`Authorization: Bearer <token>`)
- Dashboard stats are computed in `packages/domain` from encounters/quests/drops

## Future expansion

- Additional games via game registry
- Auth already in place for multi-user data scoping
- `metadata` JSON fields on models for game-specific extensions
