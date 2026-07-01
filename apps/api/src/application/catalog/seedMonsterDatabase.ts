import type { MonsterCatalogEntry } from "@game-tracker/shared";
import {
  MHR_MONSTER_CATALOG,
  MHW_MONSTER_CATALOG,
  MHWILDS_MONSTER_CATALOG,
  getWildsExtra,
  resolveBodyPartWeaknesses,
} from "@game-tracker/shared";
import type { PrismaClient } from "@prisma/client";

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function placeholderImage(name: string, size = 200): string {
  const text = encodeURIComponent(name.slice(0, 12));
  return `https://placehold.co/${size}x${size}/1e293b/94a3b8?text=${text}`;
}

function defaultImages(monsterId: string, name: string, heroUrl: string) {
  return [
    { monsterId, imageUrl: heroUrl, imageType: "render", sortOrder: 0 },
    { monsterId, imageUrl: placeholderImage(name, 120), imageType: "icon", sortOrder: 1 },
    { monsterId, imageUrl: placeholderImage(`${name} eco`, 320), imageType: "ecology", sortOrder: 2 },
    { monsterId, imageUrl: placeholderImage(`${name} art`, 320), imageType: "gallery", sortOrder: 3 },
  ];
}

function buildRiseData(entry: MonsterCatalogEntry & { monsterType?: string | null }) {
  const bodyPartWeaknesses = resolveBodyPartWeaknesses({
    name: entry.name,
    type: entry.type,
    monsterType: entry.monsterType ?? entry.species,
    species: entry.species,
    elementalWeaknesses: entry.elementalWeaknesses,
    bodyPartWeaknesses: entry.bodyPartWeaknesses,
  });

  return {
    elementalWeaknesses: entry.elementalWeaknesses,
    ailmentWeaknesses: entry.ailmentWeaknesses,
    bodyPartWeaknesses,
    huntRewards: [`${entry.name} Scale`, `${entry.name} Hide`],
    captureRewards: entry.canBeCaptured ? [`${entry.name} Scale`] : [],
    breakRewards: [`${entry.name} Claw`],
  };
}

function buildWildsData(entry: MonsterCatalogEntry & { monsterType?: string | null }) {
  const extra = getWildsExtra(entry as import("@game-tracker/shared").WildsCatalogEntry);

  const wildsBodyPartWeaknesses =
    extra.wildsBodyPartWeaknesses.length > 0
      ? extra.wildsBodyPartWeaknesses
      : resolveBodyPartWeaknesses({
      name: entry.name,
      type: entry.type,
      monsterType: entry.monsterType ?? entry.species,
      species: entry.species,
      elementalWeaknesses: entry.elementalWeaknesses,
    }).map((row) => ({
      part: row.part,
      slash: row.slash ?? 45,
      blunt: row.blunt ?? 40,
      ammo: row.pierce ?? 35,
      element: Math.max(row.fire ?? 0, row.water ?? 0, row.thunder ?? 0, row.ice ?? 0, row.dragon ?? 0),
    }));

  return {
    elementalWeaknesses: entry.elementalWeaknesses,
    bodyPartWeaknesses: wildsBodyPartWeaknesses,
    breakableParts: extra.breakableParts.length > 0 ? extra.breakableParts : ["Head", "Wings", "Tail"],
    woundData: [{ part: "Head", description: "Wounding the head increases stagger effectiveness." }],
    huntRewards: [`${entry.name} Shard`, `${entry.name} Pelt`],
    wildsMechanics: { woundsEnabled: true },
  };
}

async function upsertFromCatalogEntry(
  prisma: PrismaClient,
  entry: MonsterCatalogEntry & { monsterType?: string | null },
  game: string,
  slugSuffix: string,
) {
  const familySlug = slugify(entry.name.replace(/^(Afflicted|Risen|Primordial|Chaotic|Scorned|Seething|Flaming|Blood Orange|Violet|Silver|Gold|Pyre|Aurora|Guardian|Apex) /, ""));
  const slug = `${slugify(entry.name)}-${slugSuffix}`;
  const hero = placeholderImage(entry.name, 400);

  const monster = await prisma.gameMonster.upsert({
    where: { slug_game: { slug, game } },
    update: {
      name: entry.name,
      familySlug,
      species: entry.species,
      description: entry.description,
      monsterType: entry.monsterType ?? null,
      iconImage: placeholderImage(entry.name, 120),
      largeRenderImage: hero,
      ecologyText: entry.description,
      canBeCaptured: entry.canBeCaptured,
      monsterSize: entry.type,
    },
    create: {
      slug,
      name: entry.name,
      familySlug,
      game,
      species: entry.species,
      description: entry.description,
      monsterType: entry.monsterType ?? null,
      iconImage: placeholderImage(entry.name, 120),
      largeRenderImage: hero,
      ecologyText: entry.description,
      canBeCaptured: entry.canBeCaptured,
      monsterSize: entry.type,
    },
  });

  if (game === "monster-hunter-wilds") {
    const wildsData = buildWildsData(entry, entry.id);
    await prisma.monsterWildsData.upsert({
      where: { monsterId: monster.id },
      update: wildsData,
      create: { monsterId: monster.id, ...wildsData },
    });
  } else {
    const riseData = buildRiseData(entry);
    await prisma.monsterRiseData.upsert({
      where: { monsterId: monster.id },
      update: riseData,
      create: { monsterId: monster.id, ...riseData },
    });
  }

  await prisma.monsterImage.deleteMany({ where: { monsterId: monster.id } });
  await prisma.monsterImage.createMany({ data: defaultImages(monster.id, entry.name, hero) });

  return monster;
}

export async function refreshCatalogBodyParts(prisma: PrismaClient): Promise<number> {
  let updated = 0;
  for (const entry of MHW_MONSTER_CATALOG) {
    if (entry.type !== "large") continue;
    const slug = `${slugify(entry.name)}-world`;
    const row = await prisma.gameMonster.findFirst({ where: { slug, game: "monster-hunter" } });
    if (!row) continue;
    const riseData = buildRiseData(entry as MonsterCatalogEntry & { monsterType?: string | null });
    await prisma.monsterRiseData.upsert({
      where: { monsterId: row.id },
      update: { bodyPartWeaknesses: riseData.bodyPartWeaknesses },
      create: { monsterId: row.id, ...riseData },
    });
    updated++;
  }
  for (const entry of MHR_MONSTER_CATALOG) {
    const slug = `${slugify(entry.name)}-rise`;
    const row = await prisma.gameMonster.findFirst({ where: { slug, game: "monster-hunter-rise" } });
    if (!row) continue;
    const riseData = buildRiseData(entry as MonsterCatalogEntry & { monsterType?: string | null });
    await prisma.monsterRiseData.upsert({
      where: { monsterId: row.id },
      update: { bodyPartWeaknesses: riseData.bodyPartWeaknesses },
      create: { monsterId: row.id, ...riseData },
    });
    updated++;
  }
  for (const entry of MHWILDS_MONSTER_CATALOG) {
    const slug = `${slugify(entry.name)}-wilds`;
    const row = await prisma.gameMonster.findFirst({ where: { slug, game: "monster-hunter-wilds" } });
    if (!row) continue;
    const wildsData = buildWildsData(entry as MonsterCatalogEntry & { monsterType?: string | null });
    await prisma.monsterWildsData.upsert({
      where: { monsterId: row.id },
      update: { bodyPartWeaknesses: wildsData.bodyPartWeaknesses },
      create: { monsterId: row.id, ...wildsData },
    });
    updated++;
  }
  return updated;
}

export async function seedMonsterDatabase(prisma: PrismaClient): Promise<void> {
  const force = process.env.FORCE_SEED_CATALOG === "true";
  const refreshParts = process.env.REFRESH_CATALOG_BODY_PARTS === "true";
  const count = await prisma.gameMonster.count();

  if (refreshParts && count > 0) {
    const n = await refreshCatalogBodyParts(prisma);
    console.log(`Refreshed body-part data for ${n} catalog monsters`);
    return;
  }

  if (count > 0 && process.env.NODE_ENV !== "test" && !force) {
    console.log(`Monster database already seeded (${count} entries). Skipping.`);
    return;
  }

  if (count > 0 && force) {
    await prisma.monsterDbMaterial.deleteMany();
    await prisma.monsterImage.deleteMany();
    await prisma.monsterRiseData.deleteMany();
    await prisma.monsterWildsData.deleteMany();
    await prisma.gameMonster.deleteMany();
  }

  await prisma.gameMonster.deleteMany({ where: { game: "monster-hunter-sunbreak" } });

  for (const entry of MHW_MONSTER_CATALOG) {
    await upsertFromCatalogEntry(
      prisma,
      entry as MonsterCatalogEntry & { monsterType?: string | null },
      "monster-hunter",
      "world",
    );
  }

  for (const entry of MHR_MONSTER_CATALOG) {
    await upsertFromCatalogEntry(
      prisma,
      entry as MonsterCatalogEntry & { monsterType?: string | null },
      "monster-hunter-rise",
      "rise",
    );
  }

  for (const entry of MHWILDS_MONSTER_CATALOG) {
    await upsertFromCatalogEntry(
      prisma,
      entry as MonsterCatalogEntry & { monsterType?: string | null },
      "monster-hunter-wilds",
      "wilds",
    );
  }

  const total = await prisma.gameMonster.count();
  console.log(`Seeded monster database: ${total} game monsters`);
}
