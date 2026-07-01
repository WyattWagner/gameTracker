import { describe, expect, it } from "vitest";
import {
  GameMonsterDetailSchema,
  GameMonsterSchema,
  MonsterDbMaterialSchema,
} from "../schemas/monster-database";

describe("monster database schemas", () => {
  it("parses game monster list entries", () => {
    const parsed = GameMonsterSchema.parse({
      id: "gm1",
      slug: "rathalos-rise",
      name: "Rathalos",
      species: "flying wyvern",
      description: "A fire wyvern",
      game: "monster-hunter-rise",
      monsterType: "Flying Wyvern",
      threatLevel: 6,
      iconImage: "https://example.com/icon.png",
      largeRenderImage: "https://example.com/render.png",
      familySlug: "rathalos",
      ecologyText: null,
      canBeCaptured: true,
      monsterSize: "large",
    });
    expect(parsed.familySlug).toBe("rathalos");
  });

  it("parses catalog detail with rise and wilds data", () => {
    const parsed = GameMonsterDetailSchema.parse({
      id: "gm1",
      slug: "rathalos-wilds",
      name: "Rathalos",
      species: null,
      description: null,
      game: "monster-hunter-wilds",
      monsterType: "Flying Wyvern",
      threatLevel: 6,
      iconImage: null,
      largeRenderImage: null,
      familySlug: "rathalos",
      ecologyText: null,
      canBeCaptured: true,
      monsterSize: "large",
      riseData: null,
      wildsData: {
        elementalWeaknesses: [{ element: "dragon", stars: 3 }],
        bodyPartWeaknesses: [{ part: "Head", slash: 65, blunt: 60, ammo: 55, element: 30 }],
        breakableParts: ["Head"],
      },
      materials: [
        MonsterDbMaterialSchema.parse({
          id: "m1",
          monsterId: "gm1",
          game: "monster-hunter-wilds",
          materialName: "Rathalos Scale",
          rarity: "COMMON",
          dropSource: "Carve",
          dropRate: 35,
          rank: "LOW",
          description: null,
          icon: null,
          sortOrder: 0,
        }),
      ],
      images: [],
    });
    expect(parsed.wildsData?.bodyPartWeaknesses[0]?.part).toBe("Head");
  });
});
