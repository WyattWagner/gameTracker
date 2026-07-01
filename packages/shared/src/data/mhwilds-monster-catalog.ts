import catalogJson from "./mhwilds-monster-catalog.json";
import type { MonsterCatalogEntry } from "../schemas/catalog";
import { MonsterCatalogEntrySchema } from "../schemas/catalog";
import type { WildsBodyPartRowSchema } from "../schemas/monster-database";
import type { z } from "zod";

type WildsBodyPartRow = z.infer<typeof WildsBodyPartRowSchema>;

export type WildsCatalogEntry = MonsterCatalogEntry & {
  wildsBodyPartWeaknesses?: WildsBodyPartRow[];
  breakableParts?: string[];
};

export const MHWILDS_MONSTER_CATALOG: WildsCatalogEntry[] = catalogJson.map((entry) =>
  MonsterCatalogEntrySchema.parse(entry) as WildsCatalogEntry,
);

export const MHWILDS_CATALOG_META = {
  gameId: "monster-hunter-wilds",
  gameTitle: "Monster Hunter Wilds",
  source: "game-tracker-seed",
  sourceUrl: "https://github.com/WyattWagner/gameTracker",
} as const;

export function getWildsExtra(entry: WildsCatalogEntry) {
  const raw = catalogJson.find((r) => r.id === entry.id) as {
    wildsBodyPartWeaknesses?: WildsBodyPartRow[];
    breakableParts?: string[];
  };
  return {
    wildsBodyPartWeaknesses: raw?.wildsBodyPartWeaknesses ?? [],
    breakableParts: raw?.breakableParts ?? [],
  };
}
