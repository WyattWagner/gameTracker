import type { Drop, Encounter, Monster, Quest } from "@game-tracker/shared";

export function toMonsterDto(row: {
  id: string;
  gameId: string;
  userId: string;
  name: string;
  imageUrl: string | null;
  canBeCaptured: boolean;
  favoriteWeaponUsed: string | null;
  lastEncounterAt: Date | null;
  numberOfHunts: number;
  hunts: number;
  wins: number;
  losses: number;
  captures: number;
  failedQuests: number;
  notes: string | null;
  metadata: unknown;
}): Monster {
  return {
    id: row.id,
    gameId: row.gameId,
    userId: row.userId,
    name: row.name,
    imageUrl: row.imageUrl,
    canBeCaptured: row.canBeCaptured,
    favoriteWeaponUsed: row.favoriteWeaponUsed,
    lastEncounterAt: row.lastEncounterAt?.toISOString() ?? null,
    numberOfHunts: row.numberOfHunts,
    hunts: row.hunts,
    wins: row.wins,
    losses: row.losses,
    captures: row.captures,
    failedQuests: row.failedQuests,
    notes: row.notes,
    metadata: (row.metadata as Record<string, unknown> | null) ?? undefined,
  };
}

export function toQuestDto(
  row: {
    id: string;
    gameId: string;
    userId: string;
    name: string;
    completionStatus: string;
    timeTakenSeconds: number | null;
    cartCount: number;
    rewards: string | null;
    notes: string | null;
    weaponUsed: string | null;
    isMultiplayer: boolean;
    metadata: unknown;
  },
  monsterIds: string[],
): Quest {
  return {
    id: row.id,
    gameId: row.gameId,
    userId: row.userId,
    name: row.name,
    completionStatus: row.completionStatus as Quest["completionStatus"],
    timeTakenSeconds: row.timeTakenSeconds,
    cartCount: row.cartCount,
    rewards: row.rewards,
    notes: row.notes,
    weaponUsed: row.weaponUsed,
    isMultiplayer: row.isMultiplayer,
    monsterIds,
    metadata: (row.metadata as Record<string, unknown> | null) ?? undefined,
  };
}

export function toDropDto(row: {
  id: string;
  gameId: string;
  userId: string;
  sourceMonsterId: string;
  questId: string | null;
  dropName: string;
  rarity: string;
  quantity: number;
  dateObtained: Date;
  metadata: unknown;
}): Drop {
  return {
    id: row.id,
    gameId: row.gameId,
    userId: row.userId,
    sourceMonsterId: row.sourceMonsterId,
    questId: row.questId,
    dropName: row.dropName,
    rarity: row.rarity as Drop["rarity"],
    quantity: row.quantity,
    dateObtained: row.dateObtained.toISOString(),
    metadata: (row.metadata as Record<string, unknown> | null) ?? undefined,
  };
}

export function toEncounterDto(row: {
  id: string;
  questId: string;
  monsterId: string;
  userId: string;
  encounterDate: Date;
  result: string;
  metadata: unknown;
}): Encounter {
  return {
    id: row.id,
    questId: row.questId,
    monsterId: row.monsterId,
    userId: row.userId,
    encounterDate: row.encounterDate.toISOString(),
    result: row.result as Encounter["result"],
    metadata: (row.metadata as Record<string, unknown> | null) ?? undefined,
  };
}
