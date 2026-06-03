import { describe, expect, it } from "vitest";
import { computeDashboardStats, computeDropAggregation } from "./computeDashboardStats";

const baseMonster = {
  id: "m1",
  gameId: "monster-hunter",
  userId: "u1",
  name: "Rathalos",
  imageUrl: null,
  canBeCaptured: true,
  favoriteWeaponUsed: null,
  lastEncounterAt: null,
  numberOfHunts: 0,
  hunts: 0,
  wins: 0,
  losses: 0,
  captures: 0,
  failedQuests: 0,
  notes: null,
};

describe("computeDashboardStats", () => {
  it("aggregates hunt outcomes and most-hunted monster by hunt count", () => {
    const stats = computeDashboardStats({
      monsters: [
        {
          ...baseMonster,
          numberOfHunts: 2,
          hunts: 1,
          wins: 1,
          captures: 1,
          lastEncounterAt: "2026-01-02T00:00:00.000Z",
        },
      ],
      quests: [
        {
          id: "q1",
          gameId: "monster-hunter",
          userId: "u1",
          name: "Sky High",
          completionStatus: "COMPLETED",
          timeTakenSeconds: 600,
          cartCount: 0,
          rewards: null,
          notes: null,
          weaponUsed: "Long Sword",
          isMultiplayer: false,
          monsterIds: ["m1"],
        },
      ],
      encounters: [
        {
          id: "e1",
          questId: "q1",
          monsterId: "m1",
          userId: "u1",
          encounterDate: "2026-01-01T00:00:00.000Z",
          result: "WIN",
        },
        {
          id: "e2",
          questId: "q1",
          monsterId: "m1",
          userId: "u1",
          encounterDate: "2026-01-02T00:00:00.000Z",
          result: "CAPTURE",
        },
      ],
      drops: [
        {
          id: "d1",
          gameId: "monster-hunter",
          userId: "u1",
          sourceMonsterId: "m1",
          questId: "q1",
          dropName: "Rathalos Plate",
          rarity: "VERY_RARE",
          quantity: 1,
          dateObtained: "2026-01-02T00:00:00.000Z",
        },
      ],
    });

    expect(stats.totalQuestsCompleted).toBe(1);
    expect(stats.totalQuestsAccepted).toBe(2);
    expect(stats.totalHunts).toBe(1);
    expect(stats.monstersDefeated).toBe(1);
    expect(stats.monstersCaptured).toBe(1);
    expect(stats.mostHuntedMonster?.name).toBe("Rathalos");
    expect(stats.rarestDropObtained?.dropName).toBe("Rathalos Plate");
  });

  it("aggregates quick-action hunt counters without encounter records", () => {
    const stats = computeDashboardStats({
      monsters: [
        {
          ...baseMonster,
          numberOfHunts: 5,
          hunts: 4,
          wins: 4,
          captures: 1,
          lastEncounterAt: "2026-01-03T12:00:00.000Z",
        },
      ],
      quests: [],
      encounters: [],
      drops: [],
    });

    expect(stats.totalQuestsAccepted).toBe(5);
    expect(stats.totalHunts).toBe(4);
    expect(stats.monstersDefeated).toBe(4);
    expect(stats.monstersCaptured).toBe(1);
    expect(stats.mostHuntedMonster?.hunts).toBe(4);
    expect(stats.recentActivity[0]?.summary).toBe("Hunt Rathalos");
  });

  it("sums failed quests across monsters for dashboard failed-quest total", () => {
    const stats = computeDashboardStats({
      monsters: [
        { ...baseMonster, id: "m1", failedQuests: 2 },
        { ...baseMonster, id: "m2", name: "Magnamalo", failedQuests: 3 },
      ],
      quests: [],
      encounters: [],
      drops: [],
    });

    expect(stats.monstersFailedAgainst).toBe(5);
  });

  it("sums quests accepted and hunts across all monsters for dashboard totals", () => {
    const stats = computeDashboardStats({
      monsters: [
        { ...baseMonster, id: "m1", numberOfHunts: 4, hunts: 2 },
        { ...baseMonster, id: "m2", name: "Magnamalo", numberOfHunts: 6, hunts: 5 },
      ],
      quests: [],
      encounters: [],
      drops: [],
    });

    expect(stats.totalQuestsAccepted).toBe(10);
    expect(stats.totalHunts).toBe(7);
  });

  it("sums quests completed (wins) across all monsters", () => {
    const stats = computeDashboardStats({
      monsters: [
        { ...baseMonster, id: "m1", wins: 3 },
        { ...baseMonster, id: "m2", name: "Magnamalo", wins: 7 },
      ],
      quests: [],
      encounters: [],
      drops: [],
    });

    expect(stats.totalQuestsCompleted).toBe(10);
    expect(stats.monstersDefeated).toBe(10);
  });
});

describe("computeDropAggregation", () => {
  it("sums quantities and finds most frequent material", () => {
    const agg = computeDropAggregation([
      {
        id: "d1",
        gameId: "monster-hunter",
        userId: "u1",
        sourceMonsterId: "m1",
        questId: null,
        dropName: "Scale",
        rarity: "COMMON",
        quantity: 3,
        dateObtained: "2026-01-01T00:00:00.000Z",
      },
      {
        id: "d2",
        gameId: "monster-hunter",
        userId: "u1",
        sourceMonsterId: "m1",
        questId: null,
        dropName: "Scale",
        rarity: "COMMON",
        quantity: 2,
        dateObtained: "2026-01-02T00:00:00.000Z",
      },
    ]);

    expect(agg.totalMaterialsCollected).toBe(5);
    expect(agg.mostFrequentMaterials[0]?.dropName).toBe("Scale");
    expect(agg.mostFrequentMaterials[0]?.totalQuantity).toBe(5);
  });
});
