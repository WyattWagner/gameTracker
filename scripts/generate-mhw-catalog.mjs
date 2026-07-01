/**
 * Fetches Monster Hunter World (+ Iceborne) monsters from MHW-DB and writes a static catalog.
 * Run: node scripts/generate-mhw-catalog.mjs
 */
import fs from "node:fs";
import path from "node:path";
import {
  buildBodyPartWeaknesses,
  defaultAilmentWeaknesses,
  defaultElementalWeaknesses,
  starsToResistance,
} from "./catalog-body-parts.mjs";

const OUT = path.join(
  import.meta.dirname ?? path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Z]:)/, "$1")),
  "..",
  "packages",
  "shared",
  "src",
  "data",
  "mhw-monster-catalog.json",
);

/** Iceborne large monsters missing from or incomplete in MHW-DB list */
const ICEBORNE_SUPPLEMENT = [
  { name: "Velkhana", species: "elder dragon", monsterType: "Elder Dragon" },
  { name: "Barioth", species: "flying wyvern", monsterType: "Flying Wyvern" },
  { name: "Glavenus", species: "brute wyvern", monsterType: "Brute Wyvern" },
  { name: "Acidic Glavenus", species: "brute wyvern", monsterType: "Brute Wyvern" },
  { name: "Tigrex", species: "flying wyvern", monsterType: "Flying Wyvern" },
  { name: "Nargacuga", species: "flying wyvern", monsterType: "Flying Wyvern" },
  { name: "Brachydios", species: "brute wyvern", monsterType: "Brute Wyvern" },
  { name: "Shara Ishvalda", species: "elder dragon", monsterType: "Elder Dragon" },
  { name: "Alatreon", species: "elder dragon", monsterType: "Elder Dragon" },
  { name: "Fatalis", species: "elder dragon", monsterType: "Elder Dragon" },
  { name: "Ruiner Nergigante", species: "elder dragon", monsterType: "Elder Dragon" },
  { name: "Savage Deviljho", species: "brute wyvern", monsterType: "Brute Wyvern" },
  { name: "Seething Bazelgeuse", species: "flying wyvern", monsterType: "Flying Wyvern" },
  { name: "Furious Rajang", species: "fanged beast", monsterType: "Fanged Beast" },
  { name: "Scarred Yian Garuga", species: "bird wyvern", monsterType: "Bird Wyvern" },
  { name: "Yian Garuga", species: "bird wyvern", monsterType: "Bird Wyvern" },
  { name: "Fulgur Anjanath", species: "brute wyvern", monsterType: "Brute Wyvern" },
  { name: "Ebony Odogaron", species: "fanged wyvern", monsterType: "Fanged Wyvern" },
  { name: "Banbaro", species: "flying wyvern", monsterType: "Flying Wyvern" },
  { name: "Beotodus", species: "piscine wyvern", monsterType: "Piscine Wyvern" },
  { name: "Coral Pukei-Pukei", species: "bird wyvern", monsterType: "Bird Wyvern" },
  { name: "Nightshade Paolumu", species: "flying wyvern", monsterType: "Flying Wyvern" },
  { name: "Shrieking Legiana", species: "flying wyvern", monsterType: "Flying Wyvern" },
  { name: "Brute Tigrex", species: "flying wyvern", monsterType: "Flying Wyvern" },
  { name: "Gold Rathian", species: "flying wyvern", monsterType: "Flying Wyvern" },
  { name: "Silver Rathalos", species: "flying wyvern", monsterType: "Flying Wyvern" },
];

function mapMonster(m, expansion = "base") {
  const elementalWeaknesses = (m.weaknesses ?? [])
    .filter((w) => ["fire", "water", "thunder", "ice", "dragon"].includes(w.element))
    .map((w) => ({ element: w.element, stars: w.stars }));
  const ailmentWeaknesses = (m.weaknesses ?? [])
    .filter((w) => !["fire", "water", "thunder", "ice", "dragon"].includes(w.element))
    .map((w) => ({ ailment: w.element, stars: w.stars, resistance: starsToResistance(w.stars) }));

  const base = {
    id: `mhw-${m.id}`,
    source: "mhw-db",
    sourceId: m.id,
    name: m.name,
    type: m.type,
    species: m.species ?? null,
    monsterType: m.species ? m.species.replace(/\b\w/g, (c) => c.toUpperCase()) : null,
    description: m.description ?? null,
    elements: (m.elements ?? []).map((e) => (typeof e === "string" ? e : e.name)),
    ailments: (m.ailments ?? []).map((a) => a.name),
    locations: (m.locations ?? []).map((l) => l.name),
    elementalWeaknesses,
    ailmentWeaknesses,
    canBeCaptured: m.type === "large",
    expansion,
  };

  if (m.type === "large") {
    base.bodyPartWeaknesses = buildBodyPartWeaknesses(base);
  }
  return base;
}

function supplementEntry(name, species, monsterType, id) {
  const elementalWeaknesses = defaultElementalWeaknesses();
  const base = {
    id: `mhw-ice-${id}`,
    source: "game-tracker-seed",
    sourceId: id,
    name,
    type: "large",
    species,
    monsterType,
    description: `${name} from Monster Hunter World: Iceborne.`,
    elements: [],
    ailments: [],
    locations: [],
    elementalWeaknesses,
    ailmentWeaknesses: defaultAilmentWeaknesses(),
    canBeCaptured: true,
    expansion: "iceborne",
  };
  base.bodyPartWeaknesses = buildBodyPartWeaknesses(base);
  return base;
}

const res = await fetch("https://mhw-db.com/monsters");
if (!res.ok) throw new Error(`MHW-DB fetch failed: ${res.status}`);
const raw = await res.json();

const catalog = raw.map((m) => mapMonster(m, "base"));
const existingNames = new Set(catalog.map((m) => m.name.toLowerCase()));

let nextId = 9000;
for (const ice of ICEBORNE_SUPPLEMENT) {
  if (existingNames.has(ice.name.toLowerCase())) {
    const entry = catalog.find((m) => m.name.toLowerCase() === ice.name.toLowerCase());
    if (entry) {
      entry.expansion = "iceborne";
      if (!entry.bodyPartWeaknesses?.length) {
        entry.bodyPartWeaknesses = buildBodyPartWeaknesses({ ...entry, monsterType: ice.monsterType });
      }
    }
    continue;
  }
  catalog.push(supplementEntry(ice.name, ice.species, ice.monsterType, nextId++));
}

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(catalog, null, 2));
console.log(`Wrote ${catalog.length} monsters to ${OUT}`);
console.log(
  `Large: ${catalog.filter((m) => m.type === "large").length}, Iceborne: ${catalog.filter((m) => m.expansion === "iceborne").length}`,
);
