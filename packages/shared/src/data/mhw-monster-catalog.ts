import catalogJson from "./mhw-monster-catalog.json";
import type { MonsterCatalogEntry } from "../schemas/catalog";
import { MonsterCatalogEntrySchema } from "../schemas/catalog";
import { MHR_MONSTER_CATALOG } from "./mhr-monster-catalog";
import { MHWILDS_MONSTER_CATALOG } from "./mhwilds-monster-catalog";

export const MHW_MONSTER_CATALOG: MonsterCatalogEntry[] = catalogJson.map((entry) =>
  MonsterCatalogEntrySchema.parse(entry),
);

export const MHW_CATALOG_META = {
  gameId: "monster-hunter",
  gameTitle: "Monster Hunter World (+ Iceborne)",
  source: "mhw-db",
  sourceUrl: "https://docs.mhw-db.com/",
  attribution:
    "Monster data from the Monster Hunter World Database API (mhw-db.com). Game content © Capcom.",
} as const;

export function getMonsterCatalog(gameId: string): MonsterCatalogEntry[] {
  if (gameId === "monster-hunter") return MHW_MONSTER_CATALOG;
  if (gameId === "monster-hunter-rise") return MHR_MONSTER_CATALOG;
  if (gameId === "monster-hunter-wilds") return MHWILDS_MONSTER_CATALOG;
  return [];
}

export function findCatalogEntry(gameId: string, catalogId: string): MonsterCatalogEntry | undefined {
  return getMonsterCatalog(gameId).find((entry) => entry.id === catalogId);
}
