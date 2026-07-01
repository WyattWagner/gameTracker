import type { BodyPartWeaknessRow } from "./skeleton-archetypes";
import { buildArchetypeBodyParts, normalizePartName, resolveSkeletonArchetype } from "./skeleton-archetypes";

export interface CatalogWeaknessInput {
  name: string;
  type: "large" | "small";
  monsterType?: string | null;
  species?: string | null;
  elementalWeaknesses: { element: string; stars: number }[];
  bodyPartWeaknesses?: BodyPartWeaknessRow[];
}

/** Resolve body parts: explicit catalog data first, then skeleton archetype fallback. */
export function resolveBodyPartWeaknesses(input: CatalogWeaknessInput): BodyPartWeaknessRow[] {
  if (input.type === "small") return [];
  if (input.bodyPartWeaknesses && input.bodyPartWeaknesses.length > 0) {
    return input.bodyPartWeaknesses.map((row) => ({
      ...row,
      part: normalizePartName(row.part),
    }));
  }
  const archetype = resolveSkeletonArchetype(input.monsterType, input.species);
  return buildArchetypeBodyParts(archetype, input.elementalWeaknesses);
}

export function wildsRowToFullRow(
  row: { part: string; slash: number; blunt: number; ammo: number; element: number },
  primaryElement: string,
): BodyPartWeaknessRow {
  const base: BodyPartWeaknessRow = {
    part: normalizePartName(row.part),
    slash: row.slash,
    blunt: row.blunt,
    pierce: row.ammo,
    fire: 0,
    water: 0,
    thunder: 0,
    ice: 0,
    dragon: 0,
  };
  if (["fire", "water", "thunder", "ice", "dragon"].includes(primaryElement)) {
    base[primaryElement as keyof Pick<BodyPartWeaknessRow, "fire" | "water" | "thunder" | "ice" | "dragon">] =
      row.element;
  } else {
    base.dragon = row.element;
  }
  return base;
}

export function primaryElementFromStars(elementalWeaknesses: { element: string; stars: number }[]): string {
  let best = "dragon";
  let bestStars = -1;
  for (const w of elementalWeaknesses) {
    if (w.stars > bestStars) {
      bestStars = w.stars;
      best = w.element;
    }
  }
  return best;
}
