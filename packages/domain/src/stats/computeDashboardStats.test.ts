import { describe, expect, it } from "vitest";
import { computeDashboardStats, computeDropAggregation } from "./computeDashboardStats";

const baseMonster = {
  id: "m1",
  gameId: "monster-hunter",
  userId: "u1",
  name: "Rathalos",
  imageUrl: null,
  favoriteWeaponUsed: null,
  lastEncounterAt: null,
  numberOfHunts: 0,
  wins: 0,
  losses: 0,
  captures: 0,
  failedQuests: 0,
  notes: null,
};

describe("computeDashboardStats", () => {
  it("aggregates hunt outcomes and most hunted monster", () => {
    const stats = computeDashboardStats({
      monsters: [baseMonster],
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
    expect(stats.totalHunts).toBe(2);
    expect(stats.monstersDefeated).toBe(1);
    expect(stats.monstersCaptured).toBe(1);
    expect(stats.mostHuntedMonster?.name).toBe("Rathalos");
    expect(stats.rarestDropObtained?.dropName).toBe("Rathalos Plate");
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
