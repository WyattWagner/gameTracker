/**
 * Generates Rise (+ Sunbreak) and Wilds static catalog JSON files.
 * Run: node scripts/generate-expansion-catalogs.mjs
 */
import fs from "node:fs";
import path from "node:path";
import {
  buildBodyPartWeaknesses,
  defaultAilmentWeaknesses,
  defaultElementalWeaknesses,
} from "./catalog-body-parts.mjs";

const DATA_DIR = path.join(
  import.meta.dirname ?? path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Z]:)/, "$1")),
  "..",
  "packages",
  "shared",
  "src",
  "data",
);

const RISE_LARGE = [
  { name: "Aknosom", expansion: "base" },
  { name: "Almudron", expansion: "base" },
  { name: "Anjanath", expansion: "base" },
  { name: "Apex Arzuros", expansion: "base" },
  { name: "Apex Diablos", expansion: "base" },
  { name: "Apex Rathalos", expansion: "base" },
  { name: "Apex Rathian", expansion: "base" },
  { name: "Apex Zinogre", expansion: "base" },
  { name: "Arzuros", expansion: "base" },
  { name: "Astalos", expansion: "base" },
  { name: "Barioth", expansion: "base" },
  { name: "Barroth", expansion: "base" },
  { name: "Basarios", expansion: "base" },
  { name: "Bazelgeuse", expansion: "base" },
  { name: "Bishaten", expansion: "base" },
  { name: "Chameleos", expansion: "base" },
  { name: "Goss Harag", expansion: "base" },
  { name: "Great Baggi", expansion: "base" },
  { name: "Great Izuchi", expansion: "base" },
  { name: "Great Wroggi", expansion: "base" },
  { name: "Ibushi", expansion: "base" },
  { name: "Jyuratodus", expansion: "base" },
  { name: "Khezu", expansion: "base" },
  { name: "Kulu-Ya-Ku", expansion: "base" },
  { name: "Kushala Daora", expansion: "base" },
  { name: "Lagombi", expansion: "base" },
  { name: "Magnamalo", expansion: "base" },
  { name: "Mizutsune", expansion: "base" },
  { name: "Narwa", expansion: "base" },
  { name: "Nargacuga", expansion: "base" },
  { name: "Pukei-Pukei", expansion: "base" },
  { name: "Rakna-Kadaki", expansion: "base" },
  { name: "Rathalos", expansion: "base" },
  { name: "Rathian", expansion: "base" },
  { name: "Royal Ludroth", expansion: "base" },
  { name: "Somnacanth", expansion: "base" },
  { name: "Tetranadon", expansion: "base" },
  { name: "Tigrex", expansion: "base" },
  { name: "Tobi-Kadachi", expansion: "base" },
  { name: "Volvidon", expansion: "base" },
  { name: "Zinogre", expansion: "base" },
  { name: "Afflicted Apex Rathalos", expansion: "sunbreak" },
  { name: "Afflicted Apex Zinogre", expansion: "sunbreak" },
  { name: "Afflicted Chameleos", expansion: "sunbreak" },
  { name: "Afflicted Kushala Daora", expansion: "sunbreak" },
  { name: "Afflicted Teostra", expansion: "sunbreak" },
  { name: "Allmother Narwa", expansion: "sunbreak" },
  { name: "Aurora Somnacanth", expansion: "sunbreak" },
  { name: "Blood Orange Bishaten", expansion: "sunbreak" },
  { name: "Chaotic Gore Magala", expansion: "sunbreak" },
  { name: "Crimson Glow Valstrax", expansion: "sunbreak" },
  { name: "Daimyo Hermitaur", expansion: "sunbreak" },
  { name: "Espinas", expansion: "sunbreak" },
  { name: "Flaming Espinas", expansion: "sunbreak" },
  { name: "Furious Rajang", expansion: "sunbreak" },
  { name: "Gaismagorm", expansion: "sunbreak" },
  { name: "Garangolm", expansion: "sunbreak" },
  { name: "Gore Magala", expansion: "sunbreak" },
  { name: "Lunagaron", expansion: "sunbreak" },
  { name: "Lucent Nargacuga", expansion: "sunbreak" },
  { name: "Malzeno", expansion: "sunbreak" },
  { name: "Primordial Malzeno", expansion: "sunbreak" },
  { name: "Pyre Rakna-Kadaki", expansion: "sunbreak" },
  { name: "Risen Chameleos", expansion: "sunbreak" },
  { name: "Risen Crimson Glow Valstrax", expansion: "sunbreak" },
  { name: "Risen Kushala Daora", expansion: "sunbreak" },
  { name: "Risen Shagaru Magala", expansion: "sunbreak" },
  { name: "Risen Teostra", expansion: "sunbreak" },
  { name: "Scorned Magnamalo", expansion: "sunbreak" },
  { name: "Seething Bazelgeuse", expansion: "sunbreak" },
  { name: "Shagaru Magala", expansion: "sunbreak" },
  { name: "Shogun Ceanataur", expansion: "sunbreak" },
  { name: "Silver Rathalos", expansion: "sunbreak" },
  { name: "Gold Rathian", expansion: "sunbreak" },
  { name: "Velkhana", expansion: "sunbreak" },
  { name: "Violet Mizutsune", expansion: "sunbreak" },
];

const WILDS_LARGE = [
  "Arkveld",
  "Balahara",
  "Blangonga",
  "Chatacabra",
  "Congalala",
  "Doshaguma",
  "Gore Magala",
  "Guardian Doshaguma",
  "Guardian Ebony Odogaron",
  "Guardian Fulgur Anjanath",
  "Guardian Rathalos",
  "Guardian Rathian",
  "Guardian Zinogre",
  "Gypceros",
  "Hirabami",
  "Lala Barina",
  "Nerscylla",
  "Nu Udra",
  "Odibatorasu",
  "Quematrice",
  "Rathalos",
  "Rathian",
  "Rey Dau",
  "Rompopolo",
  "Uth Duna",
  "Xu Wu",
  "Yian Kut-Ku",
  "Zoh Shia",
];

const MONSTER_TYPES = [
  "Flying Wyvern",
  "Brute Wyvern",
  "Fanged Beast",
  "Elder Dragon",
  "Leviathan",
  "Temnoceran",
  "Bird Wyvern",
  "Piscine Wyvern",
  "Amphibian",
  "Fanged Wyvern",
  "Carapaceon",
];

function slugify(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function pickMonsterType(name, index) {
  if (name.includes("Elder") || name.includes("Narwa") || name.includes("Ibushi") || name.includes("Malzeno"))
    return "Elder Dragon";
  if (name.includes("Rath")) return "Flying Wyvern";
  if (name.includes("Tigrex") || name.includes("Diablos") || name.includes("Anjanath")) return "Brute Wyvern";
  if (name.includes("Zinogre") || name.includes("Magnamalo")) return "Fanged Wyvern";
  return MONSTER_TYPES[index % MONSTER_TYPES.length];
}

function buildWildsBodyParts(name, monsterType, elementalWeaknesses) {
  const full = buildBodyPartWeaknesses({
    type: "large",
    monsterType,
    species: monsterType,
    elementalWeaknesses,
  });
  return full.map((row) => ({
    part: row.part,
    slash: row.slash ?? 45,
    blunt: row.blunt ?? 40,
    ammo: row.pierce ?? 35,
    element: Math.max(row.fire ?? 0, row.water ?? 0, row.thunder ?? 0, row.ice ?? 0, row.dragon ?? 0),
  }));
}

function buildRiseEntry(entry, index) {
  const monsterType = pickMonsterType(entry.name, index);
  const elementalWeaknesses = defaultElementalWeaknesses();
  const base = {
    id: `mhr-${slugify(entry.name)}`,
    source: "game-tracker-seed",
    sourceId: 1000 + index,
    name: entry.name,
    type: "large",
    species: "unknown",
    monsterType,
    description: `${entry.name} from Monster Hunter Rise${entry.expansion === "sunbreak" ? ": Sunbreak" : ""}.`,
    elements: [],
    ailments: [],
    locations: [],
    elementalWeaknesses,
    ailmentWeaknesses: defaultAilmentWeaknesses(),
    canBeCaptured: !entry.name.includes("Narwa") && !entry.name.includes("Ibushi"),
    expansion: entry.expansion,
    bodyPartWeaknesses: buildBodyPartWeaknesses({
      type: "large",
      monsterType,
      species: monsterType,
      elementalWeaknesses,
    }),
  };
  return base;
}

function buildWildsEntry(name, index) {
  const monsterType = pickMonsterType(name, index);
  const elementalWeaknesses = defaultElementalWeaknesses();
  const bodyPartWeaknesses = buildWildsBodyParts(name, monsterType, elementalWeaknesses);
  return {
    id: `mhwilds-${slugify(name)}`,
    source: "game-tracker-seed",
    sourceId: 2000 + index,
    name,
    type: "large",
    species: "unknown",
    monsterType,
    description: `${name} from Monster Hunter Wilds.`,
    elements: [],
    ailments: [],
    locations: [],
    elementalWeaknesses,
    ailmentWeaknesses: [],
    canBeCaptured: true,
    expansion: "base",
    bodyPartWeaknesses,
    wildsBodyPartWeaknesses: bodyPartWeaknesses,
    breakableParts: ["Head", "Wings", "Tail"].filter((p) => bodyPartWeaknesses.some((b) => b.part === p)),
  };
}

const riseCatalog = RISE_LARGE.map((entry, i) => buildRiseEntry(entry, i));
const wildsCatalog = WILDS_LARGE.map((name, i) => buildWildsEntry(name, i));

fs.mkdirSync(DATA_DIR, { recursive: true });
fs.writeFileSync(path.join(DATA_DIR, "mhr-monster-catalog.json"), JSON.stringify(riseCatalog, null, 2));
fs.writeFileSync(path.join(DATA_DIR, "mhwilds-monster-catalog.json"), JSON.stringify(wildsCatalog, null, 2));

console.log(`Wrote ${riseCatalog.length} Rise entries and ${wildsCatalog.length} Wilds entries`);
