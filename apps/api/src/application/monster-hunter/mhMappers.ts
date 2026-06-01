import { computeAilmentStars } from "@game-tracker/domain";
import type {
  MaterialBodyPartDrop,
  MonsterAilment,
  MonsterBodyPart,
  MonsterMaterial,
  WeaknessEntry,
} from "@game-tracker/shared";

export function toBodyPartDto(row: {
  id: string;
  monsterId: string;
  name: string;
  sortOrder: number;
}): MonsterBodyPart {
  return { id: row.id, monsterId: row.monsterId, name: row.name, sortOrder: row.sortOrder };
}

export function toWeaknessDto(row: {
  id: string;
  monsterId: string;
  bodyPartId: string;
  slash: number;
  blunt: number;
  pierce: number;
  fire: number;
  water: number;
  thunder: number;
  ice: number;
  dragon: number;
}): WeaknessEntry {
  return {
    id: row.id,
    monsterId: row.monsterId,
    bodyPartId: row.bodyPartId,
    slash: row.slash,
    blunt: row.blunt,
    pierce: row.pierce,
    fire: row.fire,
    water: row.water,
    thunder: row.thunder,
    ice: row.ice,
    dragon: row.dragon,
  };
}

export function toAilmentDto(
  row: {
    id: string;
    monsterId: string;
    name: string;
    isCustom: boolean;
    initialResistance: number;
    nextResistanceThreshold: number;
    maximumResistance: number;
    naturalBuildUpDegradation: number;
    totalEffectiveness: number;
    sortOrder: number;
  },
  starRating?: 0 | 1 | 2 | 3,
): MonsterAilment {
  return {
    id: row.id,
    monsterId: row.monsterId,
    name: row.name,
    isCustom: row.isCustom,
    initialResistance: row.initialResistance,
    nextResistanceThreshold: row.nextResistanceThreshold,
    maximumResistance: row.maximumResistance,
    naturalBuildUpDegradation: row.naturalBuildUpDegradation,
    totalEffectiveness: row.totalEffectiveness,
    sortOrder: row.sortOrder,
    ...(starRating !== undefined ? { starRating } : {}),
  };
}

export function toMaterialDto(
  row: {
    id: string;
    monsterId: string;
    rank: string;
    name: string;
    targetReward: number;
    captureReward: number;
    brokenPartReward: number;
    carveReward: number;
    dropMaterialReward: number;
    sortOrder: number;
  },
  bodyPartDrops: MaterialBodyPartDrop[],
): MonsterMaterial {
  return {
    id: row.id,
    monsterId: row.monsterId,
    rank: row.rank as MonsterMaterial["rank"],
    name: row.name,
    targetReward: row.targetReward,
    captureReward: row.captureReward,
    brokenPartReward: row.brokenPartReward,
    carveReward: row.carveReward,
    dropMaterialReward: row.dropMaterialReward,
    sortOrder: row.sortOrder,
    bodyPartDrops,
  };
}

export function attachStarRatings<T extends Parameters<typeof toAilmentDto>[0]>(
  ailments: T[],
): MonsterAilment[] {
  const stars = computeAilmentStars(ailments);
  return ailments.map((a) => toAilmentDto(a, stars[a.id]));
}
