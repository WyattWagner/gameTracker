# Monster catalog

The app includes a **reference monster database** stored in PostgreSQL/SQLite (`game_monsters` and related tables) for:

- **Monster Hunter World (+ Iceborne)** — large monsters from [MHW-DB](https://docs.mhw-db.com/) plus Iceborne supplements
- **Monster Hunter Rise (+ Sunbreak)** — combined large monster roster
- **Monster Hunter Wilds** — launch roster

Three catalog game IDs: `monster-hunter`, `monster-hunter-rise`, `monster-hunter-wilds`.

Run `npm run db:seed --workspace api` (or `SEED_ON_START=true` on deploy) to populate the database.

## Database tables

| Table | Purpose |
|-------|---------|
| `game_monsters` | Core catalog entry (name, game, species, images, family slug) |
| `monster_rise_data` | Rise/Sunbreak/World weakness & reward data (JSON) |
| `monster_wilds_data` | Wilds-specific weaknesses, wounds, breakables |
| `monster_db_materials` | Reference materials per monster & rank |
| `monster_images` | Portrait, render, ecology, gallery images |

## API

| Endpoint | Description |
|----------|-------------|
| `GET /api/v1/catalog/monsters` | List with filters (`gameId`, `search`, `monsterType`, `weaknessElement`, `rank`, pagination) |
| `GET /api/v1/catalog/monsters/:id` | Full detail with materials & images |
| `GET /api/v1/catalog/monsters/family/:slug` | All game variants for a monster family |
| `POST /api/v1/monsters/from-catalog` | Create personal tracker entry from catalog |

## UI

- **Monsters page** — per-game tabs (World / Rise / Wilds); each tab has its own catalog dropdown and tracked-monster dropdown (name-list only)
- **Monster detail** — Overview, per-game tabs (World/Rise/Wilds), Weaknesses & Ailments, image lightbox, hunt log

## Refresh catalog data

```powershell
npm run catalog:generate:all
npm run build:packages
npm run db:refresh-body-parts --workspace api
```

To fully re-seed the catalog DB after JSON changes:

```powershell
$env:FORCE_SEED_CATALOG="true"; npm run db:seed --workspace api
```

If monsters are missing from the picker after updating roster scripts, the database seed was likely skipped (seed only runs when `game_monsters` is empty unless `FORCE_SEED_CATALOG=true`).

## Limitations

- Rise/Sunbreak/Wilds entries use structured seed data (expandable via `seedMonsterDatabase.ts`).
- Per-part hit zones for World use generated defaults where MHW-DB only provides global stars.
