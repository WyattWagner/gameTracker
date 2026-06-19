import type { MonsterCatalogEntry } from "@game-tracker/shared";
import { ZERO_AILMENT_BARS } from "@game-tracker/shared";
import type { PrismaClient } from "@prisma/client";

const AILMENT_NAME_MAP: Record<string, string> = {
  poison: "Poison",
  stun: "Stun",
  paralysis: "Paralysis",
  sleep: "Sleep",
  blast: "Blast",
  exhaust: "Exhaust",
  fireblight: "Fireblight",
  waterblight: "Waterblight",
  thunderblight: "Thunderblight",
  iceblight: "Iceblight",
};

function normalizeAilmentName(raw: string): string {
  const key = raw.toLowerCase().replace(/\s+/g, "");
  return AILMENT_NAME_MAP[key] ?? raw;
}

function resistanceFromStars(stars: number): number {
  if (stars >= 3) return 25;
  if (stars === 2) return 50;
  if (stars === 1) return 75;
  return 100;
}

/** MHW elemental stars → weakness matrix cell (0–99); missing element → 0. */
function elementalStarsToWeakness(stars: number): number {
  if (stars >= 3) return 75;
  if (stars === 2) return 50;
  if (stars === 1) return 25;
  return 0;
}

const ELEMENTAL_WEAKNESS_KEYS = ["fire", "water", "thunder", "ice", "dragon"] as const;

function ailmentBarsFromResistance(resistance: number) {
  return {
    initialResistance: resistance,
    nextResistanceThreshold: resistance,
    maximumResistance: resistance,
    naturalBuildUpDegradation: resistance,
    totalEffectiveness: 100 - resistance,
  };
}

/** Applies catalog reference data (notes, ailments, metadata) after default MH init. */
export async function applyMonsterCatalogData(
  prisma: PrismaClient,
  monsterId: string,
  entry: MonsterCatalogEntry,
) {
  const weaknessByAilment = new Map<string, number>();
  for (const w of entry.ailmentWeaknesses) {
    weaknessByAilment.set(normalizeAilmentName(w.ailment), w.resistance);
  }

  await prisma.$transaction(async (tx) => {
    await tx.monster.update({
      where: { id: monsterId },
      data: {
        canBeCaptured: entry.canBeCaptured,
        notes: entry.description,
        metadata: {
          catalogId: entry.id,
          catalogSource: entry.source,
          catalogSourceId: entry.sourceId,
          species: entry.species,
          elements: entry.elements,
          locations: entry.locations,
          elementalWeaknesses: entry.elementalWeaknesses,
        },
      },
    });

    const existingAilments = await tx.monsterAilment.findMany({
      where: { monsterId },
      orderBy: { sortOrder: "asc" },
    });

    for (const ailment of existingAilments) {
      const key = normalizeAilmentName(ailment.name);
      const resistance = weaknessByAilment.get(key);
      await tx.monsterAilment.update({
        where: { id: ailment.id },
        data: resistance === undefined ? ZERO_AILMENT_BARS : ailmentBarsFromResistance(resistance),
      });
      if (resistance !== undefined) {
        weaknessByAilment.delete(key);
      }
    }

    let sortOrder = existingAilments.length;
    for (const [name, resistance] of weaknessByAilment) {
      const alreadyTracked = existingAilments.some((a) => a.name.toLowerCase() === name.toLowerCase());
      if (alreadyTracked) continue;
      await tx.monsterAilment.create({
        data: {
          monsterId,
          name,
          isCustom: true,
          sortOrder: sortOrder++,
          ...ailmentBarsFromResistance(resistance),
        },
      });
    }

    const elementalWeakness = new Map<string, number>();
    for (const key of ELEMENTAL_WEAKNESS_KEYS) {
      elementalWeakness.set(key, 0);
    }
    for (const w of entry.elementalWeaknesses) {
      if (ELEMENTAL_WEAKNESS_KEYS.includes(w.element as (typeof ELEMENTAL_WEAKNESS_KEYS)[number])) {
        elementalWeakness.set(w.element, elementalStarsToWeakness(w.stars));
      }
    }

    const weaknessRows = await tx.weaknessEntry.findMany({ where: { monsterId } });
    for (const row of weaknessRows) {
      await tx.weaknessEntry.update({
        where: { id: row.id },
        data: {
          fire: elementalWeakness.get("fire") ?? 0,
          water: elementalWeakness.get("water") ?? 0,
          thunder: elementalWeakness.get("thunder") ?? 0,
          ice: elementalWeakness.get("ice") ?? 0,
          dragon: elementalWeakness.get("dragon") ?? 0,
        },
      });
    }
  });
}
