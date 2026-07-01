/**
 * Shared body-part archetype helpers for catalog generation scripts.
 */
const ARCHETYPE_PARTS = {
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

export function resolveSkeletonArchetype(monsterType, species) {
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

function starsToWeakness(stars) {
  if (stars >= 3) return 75;
  if (stars === 2) return 50;
  if (stars === 1) return 25;
  return 0;
}

function starsToSlash(stars, partIndex, total) {
  const base = 35 + stars * 8;
  const headBoost = partIndex === 0 ? 20 : 0;
  const tailBoost = partIndex === total - 1 ? 10 : 0;
  return Math.min(99, base + headBoost + tailBoost);
}

export function buildBodyPartWeaknesses(entry) {
  if (entry.type !== "large") return [];
  const archetype = resolveSkeletonArchetype(entry.monsterType, entry.species);
  const parts = ARCHETYPE_PARTS[archetype];
  const elemental = { fire: 0, water: 0, thunder: 0, ice: 0, dragon: 0 };
  for (const w of entry.elementalWeaknesses ?? []) {
    if (w.element in elemental) elemental[w.element] = starsToWeakness(w.stars);
  }
  const maxStars = (entry.elementalWeaknesses ?? []).reduce((m, w) => Math.max(m, w.stars), 1);
  return parts.map((part, i) => {
    const slash = starsToSlash(maxStars, i, parts.length);
    return {
      part,
      slash,
      blunt: Math.max(30, slash - 5),
      pierce: Math.max(28, slash - 8),
      ...elemental,
    };
  });
}

export function starsToResistance(stars) {
  if (stars >= 3) return 25;
  if (stars === 2) return 50;
  if (stars === 1) return 75;
  return 100;
}

export function defaultElementalWeaknesses() {
  return [
    { element: "fire", stars: 2 },
    { element: "water", stars: 1 },
    { element: "thunder", stars: 2 },
    { element: "ice", stars: 1 },
    { element: "dragon", stars: 3 },
  ];
}

export function defaultAilmentWeaknesses() {
  return [
    { ailment: "Poison", stars: 2, resistance: 50 },
    { ailment: "Stun", stars: 2, resistance: 50 },
    { ailment: "Paralysis", stars: 1, resistance: 75 },
    { ailment: "Sleep", stars: 1, resistance: 75 },
    { ailment: "Blast", stars: 2, resistance: 50 },
  ];
}
