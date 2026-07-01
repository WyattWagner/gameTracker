import type { GameMonsterDetail, MonsterCatalogEntry } from "@game-tracker/shared";

/** Maps DB catalog row to legacy catalog entry shape for MH import pipeline. */
export function gameMonsterDetailToCatalogEntry(detail: GameMonsterDetail): MonsterCatalogEntry {
  const rise = detail.riseData;
  const wilds = detail.wildsData;
  const elementalWeaknesses = rise?.elementalWeaknesses ?? wilds?.elementalWeaknesses ?? [];

  return {
    id: detail.id,
    source: "game-tracker-db",
    sourceId: 0,
    name: detail.name,
    type: detail.monsterSize,
    species: detail.species,
    description: detail.description,
    elements: elementalWeaknesses.filter((w) => w.stars >= 2).map((w) => w.element),
    ailments: rise?.ailmentWeaknesses.map((a) => a.ailment) ?? [],
    locations: [],
    elementalWeaknesses,
    ailmentWeaknesses: rise?.ailmentWeaknesses ?? [],
    bodyPartWeaknesses: rise?.bodyPartWeaknesses ?? undefined,
    canBeCaptured: detail.canBeCaptured,
  };
}
