import type { DashboardStats, Drop, Encounter, Monster, Quest, Rarity } from "@game-tracker/shared";
import { RARITY_RANK } from "@game-tracker/shared";

export type { Monster, Quest, Drop, Encounter, DashboardStats, Rarity };

export interface DashboardInput {
  quests: Quest[];
  encounters: Encounter[];
  drops: Drop[];
  monsters: Monster[];
}

/** Pure stats logic — testable without DB or HTTP. */
export function computeDashboardStats(input: DashboardInput): DashboardStats {
  const completedQuests = input.quests.filter((q) => q.completionStatus === "COMPLETED");
  const wins = input.encounters.filter((e) => e.result === "WIN").length;
  const captures = input.encounters.filter((e) => e.result === "CAPTURE").length;
  const failures = input.encounters.filter((e) => e.result === "FAILED" || e.result === "LOSS").length;

  const huntsByMonster = new Map<string, number>();
  for (const encounter of input.encounters) {
    huntsByMonster.set(encounter.monsterId, (huntsByMonster.get(encounter.monsterId) ?? 0) + 1);
  }

  let mostHunted: DashboardStats["mostHuntedMonster"] = null;
  for (const [monsterId, hunts] of huntsByMonster) {
    const monster = input.monsters.find((m) => m.id === monsterId);
    if (!monster) continue;
    if (!mostHunted || hunts > mostHunted.hunts) {
      mostHunted = { id: monster.id, name: monster.name, hunts };
    }
  }

  let rarestDrop: DashboardStats["rarestDropObtained"] = null;
  for (const drop of input.drops) {
    if (!rarestDrop || RARITY_RANK[drop.rarity] < RARITY_RANK[rarestDrop.rarity]) {
      rarestDrop = { id: drop.id, dropName: drop.dropName, rarity: drop.rarity };
    }
  }

  const recentActivity = [
    ...input.encounters.map((e) => ({
      id: e.id,
      type: "ENCOUNTER" as const,
      summary: `${e.result} encounter`,
      occurredAt: e.encounterDate,
    })),
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
    totalQuestsCompleted: completedQuests.length,
    totalHunts: input.encounters.length,
    monstersDefeated: wins,
    monstersCaptured: captures,
    monstersFailedAgainst: failures,
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
