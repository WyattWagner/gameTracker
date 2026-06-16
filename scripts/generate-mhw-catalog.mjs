/**
 * Fetches Monster Hunter World (+ Iceborne) monsters from MHW-DB and writes a static catalog.
 * Source: https://mhw-db.com/ (open API, see docs.mhw-db.com)
 * Run: node scripts/generate-mhw-catalog.mjs
 */
import fs from "node:fs";
import path from "node:path";

const OUT = path.join(
  import.meta.dirname ?? path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Z]:)/, "$1")),
  "..",
  "packages",
  "shared",
  "src",
  "data",
  "mhw-monster-catalog.json",
);

const res = await fetch("https://mhw-db.com/monsters");
if (!res.ok) throw new Error(`MHW-DB fetch failed: ${res.status}`);
const raw = await res.json();

/** @param {number} stars */
function starsToResistance(stars) {
  if (stars >= 3) return 25;
  if (stars === 2) return 50;
  if (stars === 1) return 75;
  return 100;
}

const catalog = raw.map((m) => ({
  id: `mhw-${m.id}`,
  source: "mhw-db",
  sourceId: m.id,
  name: m.name,
  type: m.type,
  species: m.species ?? null,
  description: m.description ?? null,
  elements: (m.elements ?? []).map((e) => (typeof e === "string" ? e : e.name)),
  ailments: (m.ailments ?? []).map((a) => a.name),
  locations: (m.locations ?? []).map((l) => l.name),
  elementalWeaknesses: (m.weaknesses ?? [])
    .filter((w) => ["fire", "water", "thunder", "ice", "dragon"].includes(w.element))
    .map((w) => ({ element: w.element, stars: w.stars })),
  ailmentWeaknesses: (m.weaknesses ?? [])
    .filter((w) => !["fire", "water", "thunder", "ice", "dragon"].includes(w.element))
    .map((w) => ({ ailment: w.element, stars: w.stars, resistance: starsToResistance(w.stars) })),
  canBeCaptured: m.type === "large",
}));

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(catalog, null, 2));
console.log(`Wrote ${catalog.length} monsters to ${OUT}`);
console.log(`Large: ${catalog.filter((m) => m.type === "large").length}, Small: ${catalog.filter((m) => m.type === "small").length}`);
