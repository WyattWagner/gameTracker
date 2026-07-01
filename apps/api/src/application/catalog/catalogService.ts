import type {
  CatalogGameId,
  GameMonsterDetail,
  GameMonsterFamily,
  ListGameMonsterQuery,
} from "@game-tracker/shared";
import {
  CATALOG_GAME_META,
  GameMonsterDetailSchema,
  GameMonsterSchema,
} from "@game-tracker/shared";
import type { Prisma } from "@prisma/client";
import { prisma } from "../../infrastructure/prisma/client";

const CACHE_TTL_MS = 60_000;
const listCache = new Map<string, { expires: number; data: unknown }>();

function cacheKey(prefix: string, params: Record<string, unknown>): string {
  return `${prefix}:${JSON.stringify(params)}`;
}

function getCached<T>(key: string): T | null {
  const entry = listCache.get(key);
  if (!entry || entry.expires < Date.now()) {
    listCache.delete(key);
    return null;
  }
  return entry.data as T;
}

function setCache(key: string, data: unknown): void {
  listCache.set(key, { expires: Date.now() + CACHE_TTL_MS, data });
}

export function invalidateCatalogCache(): void {
  listCache.clear();
}

function toGameMonster(row: {
  id: string;
  slug: string;
  name: string;
  species: string | null;
  description: string | null;
  game: string;
  monsterType: string | null;
  threatLevel: number | null;
  iconImage: string | null;
  largeRenderImage: string | null;
  familySlug: string;
  ecologyText: string | null;
  canBeCaptured: boolean;
  monsterSize: string;
}) {
  return GameMonsterSchema.parse({
    ...row,
    game: row.game,
    monsterSize: row.monsterSize === "small" ? "small" : "large",
  });
}

export async function listGameMonsters(query: ListGameMonsterQuery) {
  const key = cacheKey("list", query);
  const cached = getCached<{ monsters: ReturnType<typeof toGameMonster>[]; total: number }>(key);
  if (cached) return cached;

  const where: Prisma.GameMonsterWhereInput = {};
  if (query.gameId) where.game = query.gameId;
  if (query.type !== "all") where.monsterSize = query.type;
  if (query.monsterType) where.monsterType = { contains: query.monsterType };
  if (query.search) {
    const term = query.search;
    where.OR = [
      { name: { contains: term } },
      { species: { contains: term } },
      { familySlug: { contains: term } },
    ];
  }

  let monsterIds: string[] | undefined;
  if (query.weaknessElement) {
    const riseRows = await prisma.monsterRiseData.findMany({
      select: { monsterId: true, elementalWeaknesses: true },
    });
    const wildsRows = await prisma.monsterWildsData.findMany({
      select: { monsterId: true, elementalWeaknesses: true },
    });
    const el = query.weaknessElement;
    monsterIds = [
      ...riseRows
        .filter((r) => {
          const arr = r.elementalWeaknesses as { element: string; stars: number }[];
          return arr.some((w) => w.element === el && w.stars >= 2);
        })
        .map((r) => r.monsterId),
      ...wildsRows
        .filter((r) => {
          const arr = r.elementalWeaknesses as { element: string; stars: number }[];
          return arr.some((w) => w.element === el && w.stars >= 2);
        })
        .map((r) => r.monsterId),
    ];
    where.id = { in: monsterIds.length ? monsterIds : ["__none__"] };
  }

  if (query.rank) {
    const materialRows = await prisma.monsterDbMaterial.findMany({
      where: { rank: query.rank },
      select: { monsterId: true },
      distinct: ["monsterId"],
    });
    const rankIds = materialRows.map((r) => r.monsterId);
    where.id = where.id
      ? { in: (where.id as { in: string[] }).in.filter((id) => rankIds.includes(id)) }
      : { in: rankIds.length ? rankIds : ["__none__"] };
  }

  const skip = (query.page - 1) * query.pageSize;
  const [rows, total] = await Promise.all([
    prisma.gameMonster.findMany({
      where,
      orderBy: { name: "asc" },
      skip,
      take: query.pageSize,
    }),
    prisma.gameMonster.count({ where }),
  ]);

  const result = { monsters: rows.map(toGameMonster), total };
  setCache(key, result);
  return result;
}

export async function getGameMonsterDetail(id: string): Promise<GameMonsterDetail | null> {
  const row = await prisma.gameMonster.findUnique({
    where: { id },
    include: {
      riseData: true,
      wildsData: true,
      dbMaterials: { orderBy: { sortOrder: "asc" } },
      images: { orderBy: { sortOrder: "asc" } },
    },
  });
  if (!row) return null;

  return GameMonsterDetailSchema.parse({
    ...toGameMonster(row),
    riseData: row.riseData
      ? {
          elementalWeaknesses: row.riseData.elementalWeaknesses,
          ailmentWeaknesses: row.riseData.ailmentWeaknesses,
          statusResistances: row.riseData.statusResistances ?? undefined,
          bodyPartWeaknesses: row.riseData.bodyPartWeaknesses ?? undefined,
          huntRewards: row.riseData.huntRewards ?? undefined,
          captureRewards: row.riseData.captureRewards ?? undefined,
          breakRewards: row.riseData.breakRewards ?? undefined,
        }
      : null,
    wildsData: row.wildsData
      ? {
          elementalWeaknesses: row.wildsData.elementalWeaknesses,
          bodyPartWeaknesses: row.wildsData.bodyPartWeaknesses,
          woundData: row.wildsData.woundData ?? undefined,
          breakableParts: row.wildsData.breakableParts ?? undefined,
          resistanceValues: row.wildsData.resistanceValues ?? undefined,
          huntRewards: row.wildsData.huntRewards ?? undefined,
          wildsMechanics: row.wildsData.wildsMechanics ?? undefined,
        }
      : null,
    materials: row.dbMaterials.map((m) => ({
      ...m,
      rarity: m.rarity,
      dropSource: m.dropSource,
      dropRate: m.dropRate,
      description: m.description,
      icon: m.icon,
      rank: m.rank,
    })),
    images: row.images,
  });
}

export async function getFamilyBySlug(familySlug: string): Promise<GameMonsterFamily | null> {
  const rows = await prisma.gameMonster.findMany({
    where: { familySlug },
    orderBy: { game: "asc" },
  });
  if (!rows.length) return null;

  return {
    familySlug,
    name: rows[0]!.name.replace(/^(Apex|Risen|Guardian|Afflicted) /, ""),
    games: rows.map((r) => ({
      game: r.game as CatalogGameId,
      monsterId: r.id,
      name: r.name,
    })),
  };
}

export async function resolveFamilySlugFromName(name: string): Promise<string> {
  const normalized = name
    .toLowerCase()
    .replace(/^(apex|risen|guardian|afflicted|primordial|chaotic)\s+/i, "")
    .trim();
  const row = await prisma.gameMonster.findFirst({
    where: { name: { contains: normalized } },
    select: { familySlug: true },
  });
  if (row) return row.familySlug;
  return normalized.replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export function catalogMetaForGame(gameId: CatalogGameId) {
  return CATALOG_GAME_META[gameId];
}
