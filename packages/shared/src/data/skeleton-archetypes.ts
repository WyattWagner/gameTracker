import type { BodyPartWeaknessRowSchema } from "../schemas/monster-database";
import type { z } from "zod";

export type BodyPartWeaknessRow = z.infer<typeof BodyPartWeaknessRowSchema>;

export type SkeletonArchetype =
  | "Flying Wyvern"
  | "Brute Wyvern"
  | "Fanged Wyvern"
  | "Piscine Wyvern"
  | "Bird Wyvern"
  | "Leviathan"
  | "Amphibian"
  | "Fanged Beast"
  | "Temnoceran"
  | "Elder Dragon"
  | "Carapaceon"
  | "Generic";

const ARCHETYPE_PARTS: Record<SkeletonArchetype, string[]> = {
  "Flying Wyvern": ["Head", "Neck", "Body", "Back", "Wings", "Legs", "Tail"],
  "Brute Wyvern": ["Head", "Body", "Arms", "Legs", "Tail"],
  "Fanged Wyvern": ["Head", "Body", "Forelegs", "Hind Legs", "Tail"],
  "Piscine Wyvern": ["Head", "Body", "Fins", "Legs", "Tail"],
  "Bird Wyvern": ["Head", "Body", "Wings", "Legs", "Tail"],
  Leviathan: ["Head", "Body", "Fins", "Back", "Legs", "Tail"],
  Amphibian: ["Head", "Body", "Forelegs", "Hind Legs", "Tail"],
  "Fanged Beast": ["Head", "Body", "Forelegs", "Hind Legs", "Tail"],
  Temnoceran: ["Head", "Body", "Legs", "Tail"],
  "Elder Dragon": ["Head", "Body", "Wings", "Legs", "Tail"],
  Carapaceon: ["Head", "Body", "Claw", "Legs", "Tail"],
  Generic: ["Head", "Neck", "Body", "Back", "Wings", "Forelegs", "Hind Legs", "Tail"],
};

function starsToWeakness(stars: number): number {
  if (stars >= 3) return 75;
  if (stars === 2) return 50;
  if (stars === 1) return 25;
  return 0;
}

function starsToSlash(stars: number, partIndex: number, total: number): number {
  const base = 35 + stars * 8;
  const headBoost = partIndex === 0 ? 20 : 0;
  const tailBoost = partIndex === total - 1 ? 10 : 0;
  return Math.min(99, base + headBoost + tailBoost);
}

/** Resolve skeleton archetype from monster type / species strings. */
export function resolveSkeletonArchetype(monsterType?: string | null, species?: string | null): SkeletonArchetype {
  const hint = `${monsterType ?? ""} ${species ?? ""}`.toLowerCase();
  if (hint.includes("elder dragon")) return "Elder Dragon";
  if (hint.includes("flying wyvern")) return "Flying Wyvern";
  if (hint.includes("brute wyvern")) return "Brute Wyvern";
  if (hint.includes("fanged wyvern")) return "Fanged Wyvern";
  if (hint.includes("piscine wyvern")) return "Piscine Wyvern";
  if (hint.includes("bird wyvern")) return "Bird Wyvern";
  if (hint.includes("leviathan")) return "Leviathan";
  if (hint.includes("amphibian")) return "Amphibian";
  if (hint.includes("fanged beast")) return "Fanged Beast";
  if (hint.includes("temnoceran")) return "Temnoceran";
  if (hint.includes("carapaceon")) return "Carapaceon";
  return "Generic";
}

/** Build per-part weakness rows from archetype + global elemental stars. */
export function buildArchetypeBodyParts(
  archetype: SkeletonArchetype,
  elementalWeaknesses: { element: string; stars: number }[],
): BodyPartWeaknessRow[] {
  const parts = ARCHETYPE_PARTS[archetype];
  const elemental = new Map<string, number>();
  for (const el of ["fire", "water", "thunder", "ice", "dragon"]) {
    elemental.set(el, 0);
  }
  for (const w of elementalWeaknesses) {
    if (elemental.has(w.element)) {
      elemental.set(w.element, starsToWeakness(w.stars));
    }
  }

  return parts.map((part, i) => {
    const slash = starsToSlash(
      elementalWeaknesses.reduce((max, w) => Math.max(max, w.stars), 1),
      i,
      parts.length,
    );
    const blunt = Math.max(30, slash - 5);
    const pierce = Math.max(28, slash - 8);
    return {
      part,
      slash,
      blunt,
      pierce,
      fire: elemental.get("fire") ?? 0,
      water: elemental.get("water") ?? 0,
      thunder: elemental.get("thunder") ?? 0,
      ice: elemental.get("ice") ?? 0,
      dragon: elemental.get("dragon") ?? 0,
    };
  });
}

export function normalizePartName(name: string): string {
  const n = name.trim();
  const aliases: Record<string, string> = {
    wing: "Wings",
    wings: "Wings",
    foreleg: "Forelegs",
    forelegs: "Forelegs",
    "hind leg": "Hind Legs",
    "hind legs": "Hind Legs",
    legs: "Legs",
    arm: "Arms",
    arms: "Arms",
    fin: "Fins",
    fins: "Fins",
    claw: "Claw",
  };
  return aliases[n.toLowerCase()] ?? n;
}
