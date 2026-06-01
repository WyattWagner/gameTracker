import { describe, expect, it } from "vitest";
import { computeAilmentStars, formatStarRating } from "./computeAilmentStars";
import { cloneMaterialName, cloneMaterialsForRank } from "./cloneMaterialRank";

describe("computeAilmentStars", () => {
  it("returns 0 stars when any bar is 0%", () => {
    const stars = computeAilmentStars([
      {
        id: "a1",
        initialResistance: 0,
        nextResistanceThreshold: 50,
        maximumResistance: 50,
        naturalBuildUpDegradation: 50,
        totalEffectiveness: 50,
      },
    ]);
    expect(stars.a1).toBe(0);
    expect(formatStarRating(0)).toBe("-");
  });

  it("assigns relative tiers when all bars non-zero", () => {
    const stars = computeAilmentStars([
      {
        id: "high",
        initialResistance: 100,
        nextResistanceThreshold: 100,
        maximumResistance: 100,
        naturalBuildUpDegradation: 100,
        totalEffectiveness: 100,
      },
      {
        id: "low",
        initialResistance: 25,
        nextResistanceThreshold: 25,
        maximumResistance: 25,
        naturalBuildUpDegradation: 25,
        totalEffectiveness: 25,
      },
    ]);
    expect(stars.high).toBe(3);
    expect(stars.low).toBe(1);
    expect(formatStarRating(3)).toBe("★★★");
  });
});

describe("cloneMaterialRank", () => {
  it("appends + for LOW to HIGH", () => {
    expect(cloneMaterialName("Monster Scale", "LOW", "HIGH")).toBe("Monster Scale+");
  });

  it("appends + for HIGH to MASTER (Scale+ → Scale++)", () => {
    expect(cloneMaterialName("Monster Scale+", "HIGH", "MASTER")).toBe("Monster Scale++");
  });

  it("clones all materials with percents", () => {
    const cloned = cloneMaterialsForRank(
      [{ name: "Scale", targetReward: 45, captureReward: 30, brokenPartReward: 0, carveReward: 55, dropMaterialReward: 10 }],
      "LOW",
      "HIGH",
    );
    expect(cloned[0]?.name).toBe("Scale+");
    expect(cloned[0]?.carveReward).toBe(55);
  });
});
