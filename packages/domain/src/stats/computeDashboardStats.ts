import type { DashboardStats, Drop, Encounter, Monster, Quest, Rarity } from "@game-tracker/shared";
import { RARITY_RANK } from "@game-tracker/shared";

export type { Monster, Quest, Drop, Encounter, DashboardStats, Rarity };

export interface DashboardInput {
  quests: Quest[];
  encounters: Encounter[];
  drops: Drop[];
  monsters: Monster[];
}

/** Sum Quests Accepted across every monster (matches per-monster "Quests Accepted" counters). */
export function sumMonsterQuestsAccepted(monsters: Monster[]): number {
  return monsters.reduce((sum, m) => sum + (m.numberOfHunts ?? 0), 0);
}

/** Sum Hunts across every monster (matches per-monster "Hunts" counters). */
export function sumMonsterHunts(monsters: Monster[]): number {
  return monsters.reduce((sum, m) => sum + (m.hunts ?? 0), 0);
}

/** Pure stats logic — testable without DB or HTTP. */
export function computeDashboardStats(input: DashboardInput): DashboardStats {
  const totalQuestsAccepted = sumMonsterQuestsAccepted(input.monsters);
  const totalHunts = sumMonsterHunts(input.monsters);
  const totalQuestsCompleted = input.monsters.reduce((sum, m) => sum + m.wins, 0);
  const monstersDefeated = totalQuestsCompleted;
  const monstersCaptured = input.monsters.reduce((sum, m) => sum + m.captures, 0);
  const monstersFailedAgainst = input.monsters.reduce((sum, m) => sum + m.failedQuests, 0);

  let mostHunted: DashboardStats["mostHuntedMonster"] = null;
  for (const monster of input.monsters) {
    if (monster.hunts === 0) continue;
    if (!mostHunted || monster.hunts > mostHunted.hunts) {
      mostHunted = { id: monster.id, name: monster.name, hunts: monster.hunts };
    }
  }

  let rarestDrop: DashboardStats["rarestDropObtained"] = null;
  for (const drop of input.drops) {
    if (!rarestDrop || RARITY_RANK[drop.rarity] < RARITY_RANK[rarestDrop.rarity]) {
      rarestDrop = { id: drop.id, dropName: drop.dropName, rarity: drop.rarity };
    }
  }

  const recentActivity = [
    ...input.monsters
      .filter((m) => m.lastEncounterAt)
      .map((m) => ({
        id: `hunt-${m.id}-${m.lastEncounterAt}`,
        type: "ENCOUNTER" as const,
        summary: `Hunt ${m.name}`,
        occurredAt: m.lastEncounterAt!,
      })),
    ...input.encounters.map((e) => {
      const monster = input.monsters.find((m) => m.id === e.monsterId);
      const label = monster?.name ?? "monster";
      return {
        id: e.id,
        type: "ENCOUNTER" as const,
        summary: `Hunt ${label} (${e.result})`,
        occurredAt: e.encounterDate,
      };
    }),
    ...input.drops.map((d) => ({
      id: d.id,
      type: "DROP" as const,
      summary: `Obtained ${d.dropName}`,
      occurredAt: d.dateObtained,
    })),
    ...input.quests.map((q) => ({
      id: q.id,
      type: "QUEST" as const,
      summary: `Quest ${q.name} (${q.completionStatus})`,
      occurredAt: new Date().toISOString(),
    })),
  ]
    .sort((a, b) => b.occurredAt.localeCompare(a.occurredAt))
    .slice(0, 10);

  return {
    totalQuestsCompleted,
    totalQuestsAccepted,
    totalHunts,
    monstersDefeated,
    monstersCaptured,
    monstersFailedAgainst,
    mostHuntedMonster: mostHunted,
    rarestDropObtained: rarestDrop,
    recentActivity,
  };
}

export function computeDropAggregation(drops: Drop[]) {
  const totals = new Map<string, { dropName: string; rarity: Rarity; totalQuantity: number }>();
  for (const drop of drops) {
    const existing = totals.get(drop.dropName);
    if (existing) {
      existing.totalQuantity += drop.quantity;
      if (RARITY_RANK[drop.rarity] < RARITY_RANK[existing.rarity]) {
        existing.rarity = drop.rarity;
      }
    } else {
      totals.set(drop.dropName, {
        dropName: drop.dropName,
        rarity: drop.rarity,
        totalQuantity: drop.quantity,
      });
    }
  }

  const materials = [...totals.values()];
  return {
    totalMaterialsCollected: drops.reduce((sum, d) => sum + d.quantity, 0),
    rarestMaterials: [...materials].sort((a, b) => RARITY_RANK[a.rarity] - RARITY_RANK[b.rarity]).slice(0, 5),
    mostFrequentMaterials: [...materials]
      .sort((a, b) => b.totalQuantity - a.totalQuantity)
      .slice(0, 5)
      .map(({ dropName, totalQuantity }) => ({ dropName, totalQuantity })),
  };
}
