# Monster catalog

The app includes a **reference monster database** for **Monster Hunter World (+ Iceborne)** so you can add real monsters without typing everything manually.

## What's included

| Stat | Count |
|------|-------|
| Total monsters in catalog | **58** |
| Large monsters (hunt targets) | **42** |
| Small monsters | **16** |

Data per entry:

- Name, species, description
- Locations, elements
- Elemental weaknesses (fire/water/thunder/ice/dragon stars)
- Ailment weaknesses (poison, stun, sleep, etc.)
- Whether the monster can be captured

## Data source

- **API:** [Monster Hunter World Database (MHW-DB)](https://docs.mhw-db.com/)
- **Endpoint:** `https://mhw-db.com/monsters`
- **License / attribution:** Game content © Capcom. Catalog is derived from the open MHW-DB API.

To refresh the bundled catalog from the live API:

```powershell
npm run catalog:generate
npm run build:packages
```

## How it works in the app

1. **Monsters page** → **Add from game database** → pick a monster → **Add from catalog**
2. API `GET /api/v1/catalog/monsters` — browse catalog (auth required)
3. API `POST /api/v1/monsters/from-catalog` — creates your personal tracker entry with:
   - Default MH body parts + weakness matrix (zeroed; edit per monster)
   - Ailments without catalog weakness data → **all resistance bars set to 0%** (0 stars)
- Elemental columns without catalog data → **0** on all body parts in the weakness matrix
   - Notes = hunter field guide description
   - `metadata.catalogId` linking back to the reference entry

Each user still gets **their own** hunt stats; the catalog is read-only reference data.

## Other Monster Hunter games

The architecture supports more catalogs (`gameId` + static JSON per title). Candidates:

| Game | Possible source |
|------|-----------------|
| MH Rise / Sunbreak | [Neryss/monster_hunter_db](https://github.com/Neryss/monster_hunter_db) |
| Multi-game | [CrimsonNynja/monster-hunter-DB](https://github.com/CrimsonNynja/monster-hunter-DB) |

MHW was chosen first because MHW-DB has a clean REST API and complete large-monster coverage.

## Limitations

- **Body-part hit zones** are not imported (MHW-DB uses global elemental stars, not per-part matrix values). You still edit the weakness tab manually.
- **Materials / rewards** are not imported yet.
- Catalog is **MHW only**; Rise/Wilds would need additional data files and a `catalog:generate` script per game.
