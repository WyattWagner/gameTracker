import catalogJson from "./mhr-monster-catalog.json";
import type { MonsterCatalogEntry } from "../schemas/catalog";
import { MonsterCatalogEntrySchema } from "../schemas/catalog";

export const MHR_MONSTER_CATALOG: MonsterCatalogEntry[] = catalogJson.map((entry) =>
  MonsterCatalogEntrySchema.parse(entry),
);

export const MHR_CATALOG_META = {
  gameId: "monster-hunter-rise",
  gameTitle: "Monster Hunter Rise (+ Sunbreak)",
  source: "game-tracker-seed",
  sourceUrl: "https://github.com/WyattWagner/gameTracker",
} as const;
