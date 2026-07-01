import { describe, expect, it } from "vitest";
import { buildArchetypeBodyParts, resolveSkeletonArchetype } from "./skeleton-archetypes";
import { resolveBodyPartWeaknesses } from "./body-part-utils";
import { MHW_MONSTER_CATALOG } from "./mhw-monster-catalog";

describe("skeleton archetypes", () => {
  it("Flying Wyvern has wings and legs, not just head/body/tail", () => {
    const parts = buildArchetypeBodyParts("Flying Wyvern", [{ element: "dragon", stars: 3 }]);
    const names = parts.map((p) => p.part);
    expect(names).toContain("Wings");
    expect(names).toContain("Legs");
    expect(parts.length).toBeGreaterThanOrEqual(6);
  });

  it("resolveSkeletonArchetype detects flying wyvern from species", () => {
    expect(resolveSkeletonArchetype("Flying Wyvern", "flying wyvern")).toBe("Flying Wyvern");
  });

  it("Rathalos World catalog entry has many body parts", () => {
    const rathalos = MHW_MONSTER_CATALOG.find((m) => m.name === "Rathalos" && m.type === "large");
    expect(rathalos).toBeDefined();
    const parts = resolveBodyPartWeaknesses({
      name: rathalos!.name,
      type: "large",
      monsterType: "Flying Wyvern",
      species: rathalos!.species,
      elementalWeaknesses: rathalos!.elementalWeaknesses,
      ...(rathalos!.bodyPartWeaknesses ? { bodyPartWeaknesses: rathalos!.bodyPartWeaknesses } : {}),
    });
    expect(parts.length).toBeGreaterThanOrEqual(6);
  });
});
