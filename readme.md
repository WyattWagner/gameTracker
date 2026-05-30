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

```powershell
# Terminal 1
npm run dev:api

# Terminal 2
npm run dev:web
```

- Web: http://localhost:5173
- API: http://localhost:3001/api/v1

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
