import type { GameMonsterDetail, MonsterCatalogEntry } from "@game-tracker/shared";
import {
  ZERO_AILMENT_BARS,
  normalizePartName,
  primaryElementFromStars,
  wildsRowToFullRow,
} from "@game-tracker/shared";
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

const ELEMENTAL_WEAKNESS_KEYS = ["fire", "water", "thunder", "ice", "dragon"] as const;

function normalizeAilmentName(raw: string): string {
  const key = raw.toLowerCase().replace(/\s+/g, "");
  return AILMENT_NAME_MAP[key] ?? raw;
}

function elementalStarsToWeakness(stars: number): number {
  if (stars >= 3) return 75;
  if (stars === 2) return 50;
  if (stars === 1) return 25;
  return 0;
}

function ailmentBarsFromResistance(resistance: number) {
  return {
    initialResistance: resistance,
    nextResistanceThreshold: resistance,
    maximumResistance: resistance,
    naturalBuildUpDegradation: resistance,
    totalEffectiveness: 100 - resistance,
  };
}

type BodyPartRow = {
  part: string;
  slash?: number;
  blunt?: number;
  pierce?: number;
  fire?: number;
  water?: number;
  thunder?: number;
  ice?: number;
  dragon?: number;
};

function extractBodyParts(detail: GameMonsterDetail): BodyPartRow[] {
  const riseParts = detail.riseData?.bodyPartWeaknesses ?? [];
  if (riseParts.length > 0) {
    return riseParts.map((row) => ({
      part: normalizePartName(row.part),
      slash: row.slash,
      blunt: row.blunt,
      pierce: row.pierce,
      fire: row.fire,
      water: row.water,
      thunder: row.thunder,
      ice: row.ice,
      dragon: row.dragon,
    }));
  }

  const wildsParts = detail.wildsData?.bodyPartWeaknesses ?? [];
  if (wildsParts.length > 0) {
    const primary = primaryElementFromStars(detail.wildsData!.elementalWeaknesses);
    return wildsParts.map((row) => wildsRowToFullRow(row, primary));
  }

  return [];
}

function globalElementalMap(entry: MonsterCatalogEntry): Map<string, number> {
  const map = new Map<string, number>();
  for (const key of ELEMENTAL_WEAKNESS_KEYS) map.set(key, 0);
  for (const w of entry.elementalWeaknesses) {
    if (ELEMENTAL_WEAKNESS_KEYS.includes(w.element as (typeof ELEMENTAL_WEAKNESS_KEYS)[number])) {
      map.set(w.element, elementalStarsToWeakness(w.stars));
    }
  }
  return map;
}

async function replaceBodyPartsFromCatalog(
  tx: Parameters<Parameters<PrismaClient["$transaction"]>[0]>[0],
  monsterId: string,
  parts: BodyPartRow[],
  fallbackElemental: Map<string, number>,
) {
  await tx.materialBodyPartDrop.deleteMany({ where: { material: { monsterId } } });
  await tx.weaknessEntry.deleteMany({ where: { monsterId } });
  await tx.monsterBodyPart.deleteMany({ where: { monsterId } });

  for (let i = 0; i < parts.length; i++) {
    const row = parts[i]!;
    const bodyPart = await tx.monsterBodyPart.create({
      data: { monsterId, name: row.part, sortOrder: i },
    });
    await tx.weaknessEntry.create({
      data: {
        monsterId,
        bodyPartId: bodyPart.id,
        slash: row.slash ?? 0,
        blunt: row.blunt ?? 0,
        pierce: row.pierce ?? 0,
        fire: row.fire ?? fallbackElemental.get("fire") ?? 0,
        water: row.water ?? fallbackElemental.get("water") ?? 0,
        thunder: row.thunder ?? fallbackElemental.get("thunder") ?? 0,
        ice: row.ice ?? fallbackElemental.get("ice") ?? 0,
        dragon: row.dragon ?? fallbackElemental.get("dragon") ?? 0,
      },
    });
  }
}

async function applyGlobalElementalToExistingParts(
  tx: Parameters<Parameters<PrismaClient["$transaction"]>[0]>[0],
  monsterId: string,
  elemental: Map<string, number>,
) {
  const rows = await tx.weaknessEntry.findMany({ where: { monsterId } });
  for (const row of rows) {
    await tx.weaknessEntry.update({
      where: { id: row.id },
      data: {
        fire: elemental.get("fire") ?? 0,
        water: elemental.get("water") ?? 0,
        thunder: elemental.get("thunder") ?? 0,
        ice: elemental.get("ice") ?? 0,
        dragon: elemental.get("dragon") ?? 0,
      },
    });
  }
}

/** Applies catalog reference data to a tracked monster. */
export async function applyMonsterCatalogData(
  prisma: PrismaClient,
  monsterId: string,
  entry: MonsterCatalogEntry,
  detail?: GameMonsterDetail,
) {
  const weaknessByAilment = new Map<string, number>();
  for (const w of entry.ailmentWeaknesses) {
    weaknessByAilment.set(normalizeAilmentName(w.ailment), w.resistance);
  }

  const bodyParts = detail ? extractBodyParts(detail) : [];
  const fallbackElemental = globalElementalMap(entry);

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
      if (resistance !== undefined) weaknessByAilment.delete(key);
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

    if (bodyParts.length > 0) {
      await replaceBodyPartsFromCatalog(tx, monsterId, bodyParts, fallbackElemental);
    } else {
      await applyGlobalElementalToExistingParts(tx, monsterId, fallbackElemental);
    }
  });
}

export async function refreshTrackedMonsterFromCatalog(
  prisma: PrismaClient,
  monsterId: string,
  detail: GameMonsterDetail,
  entry: MonsterCatalogEntry,
) {
  await applyMonsterCatalogData(prisma, monsterId, entry, detail);
}
