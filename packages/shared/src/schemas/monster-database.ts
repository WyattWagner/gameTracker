import { z } from "zod";
import { RaritySchema } from "./common";

export const CatalogGameIdSchema = z.enum([
  "monster-hunter",
  "monster-hunter-rise",
  "monster-hunter-wilds",
]);
export type CatalogGameId = z.infer<typeof CatalogGameIdSchema>;

export const MonsterImageTypeSchema = z.enum(["portrait", "render", "icon", "ecology", "gallery"]);
export type MonsterImageType = z.infer<typeof MonsterImageTypeSchema>;

export const ElementalWeaknessRowSchema = z.object({
  element: z.string(),
  stars: z.number().int().min(0).max(3),
});

export const AilmentWeaknessRowSchema = z.object({
  ailment: z.string(),
  stars: z.number().int().min(0).max(3),
  resistance: z.number().int().min(0).max(100),
});

export const BodyPartWeaknessRowSchema = z.object({
  part: z.string(),
  slash: z.number().int().min(0).max(99).optional(),
  blunt: z.number().int().min(0).max(99).optional(),
  pierce: z.number().int().min(0).max(99).optional(),
  ammo: z.number().int().min(0).max(99).optional(),
  fire: z.number().int().min(0).max(99).optional(),
  water: z.number().int().min(0).max(99).optional(),
  thunder: z.number().int().min(0).max(99).optional(),
  ice: z.number().int().min(0).max(99).optional(),
  dragon: z.number().int().min(0).max(99).optional(),
});

export const WildsBodyPartRowSchema = z.object({
  part: z.string(),
  slash: z.number().int().min(0).max(99),
  blunt: z.number().int().min(0).max(99),
  ammo: z.number().int().min(0).max(99),
  element: z.number().int().min(0).max(99),
});

export const MonsterRiseDataSchema = z.object({
  elementalWeaknesses: z.array(ElementalWeaknessRowSchema),
  ailmentWeaknesses: z.array(AilmentWeaknessRowSchema),
  statusResistances: z.record(z.string(), z.number()).optional(),
  bodyPartWeaknesses: z.array(BodyPartWeaknessRowSchema).optional(),
  huntRewards: z.array(z.string()).optional(),
  captureRewards: z.array(z.string()).optional(),
  breakRewards: z.array(z.string()).optional(),
});
export type MonsterRiseData = z.infer<typeof MonsterRiseDataSchema>;

export const MonsterWildsDataSchema = z.object({
  elementalWeaknesses: z.array(ElementalWeaknessRowSchema),
  bodyPartWeaknesses: z.array(WildsBodyPartRowSchema),
  woundData: z.array(z.object({ part: z.string(), description: z.string() })).optional(),
  breakableParts: z.array(z.string()).optional(),
  resistanceValues: z.record(z.string(), z.number()).optional(),
  huntRewards: z.array(z.string()).optional(),
  wildsMechanics: z.record(z.string(), z.unknown()).optional(),
});
export type MonsterWildsData = z.infer<typeof MonsterWildsDataSchema>;

export const MonsterDbMaterialSchema = z.object({
  id: z.string(),
  monsterId: z.string(),
  game: z.string(),
  materialName: z.string(),
  rarity: RaritySchema,
  dropSource: z.string().nullable(),
  dropRate: z.number().int().nullable(),
  rank: z.enum(["LOW", "HIGH", "MASTER"]),
  description: z.string().nullable(),
  icon: z.string().nullable(),
  sortOrder: z.number().int(),
});
export type MonsterDbMaterial = z.infer<typeof MonsterDbMaterialSchema>;

export const MonsterImageSchema = z.object({
  id: z.string(),
  monsterId: z.string(),
  imageUrl: z.string(),
  imageType: MonsterImageTypeSchema,
  sortOrder: z.number().int(),
});
export type MonsterImage = z.infer<typeof MonsterImageSchema>;

export const GameMonsterSchema = z.object({
  id: z.string(),
  slug: z.string(),
  name: z.string(),
  species: z.string().nullable(),
  description: z.string().nullable(),
  game: CatalogGameIdSchema,
  monsterType: z.string().nullable(),
  threatLevel: z.number().int().nullable(),
  iconImage: z.string().nullable(),
  largeRenderImage: z.string().nullable(),
  familySlug: z.string(),
  ecologyText: z.string().nullable(),
  canBeCaptured: z.boolean(),
  monsterSize: z.enum(["large", "small"]),
});
export type GameMonster = z.infer<typeof GameMonsterSchema>;

export const GameMonsterDetailSchema = GameMonsterSchema.extend({
  riseData: MonsterRiseDataSchema.nullable(),
  wildsData: MonsterWildsDataSchema.nullable(),
  materials: z.array(MonsterDbMaterialSchema),
  images: z.array(MonsterImageSchema),
});
export type GameMonsterDetail = z.infer<typeof GameMonsterDetailSchema>;

export const GameMonsterFamilySchema = z.object({
  familySlug: z.string(),
  name: z.string(),
  games: z.array(
    z.object({
      game: CatalogGameIdSchema,
      monsterId: z.string(),
      name: z.string(),
    }),
  ),
});
export type GameMonsterFamily = z.infer<typeof GameMonsterFamilySchema>;

export const ListGameMonsterQuerySchema = z.object({
  gameId: CatalogGameIdSchema.optional(),
  search: z.string().optional(),
  type: z.enum(["large", "small", "all"]).default("all"),
  monsterType: z.string().optional(),
  weaknessElement: z.enum(["fire", "water", "thunder", "ice", "dragon"]).optional(),
  rank: z.enum(["LOW", "HIGH", "MASTER"]).optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(50),
});
export type ListGameMonsterQuery = z.infer<typeof ListGameMonsterQuerySchema>;

export const GameMonsterListResponseSchema = z.object({
  monsters: z.array(GameMonsterSchema),
  total: z.number().int().nonnegative(),
  page: z.number().int().positive(),
  pageSize: z.number().int().positive(),
  gameTitle: z.string(),
  source: z.string(),
  sourceUrl: z.string(),
});
export type GameMonsterListResponse = z.infer<typeof GameMonsterListResponseSchema>;

export const CATALOG_GAME_META: Record<
  CatalogGameId,
  { gameTitle: string; source: string; sourceUrl: string }
> = {
  "monster-hunter": {
    gameTitle: "Monster Hunter World (+ Iceborne)",
    source: "mhw-db",
    sourceUrl: "https://docs.mhw-db.com/",
  },
  "monster-hunter-rise": {
    gameTitle: "Monster Hunter Rise (+ Sunbreak)",
    source: "game-tracker-seed",
    sourceUrl: "https://github.com/WyattWagner/gameTracker",
  },
  "monster-hunter-wilds": {
    gameTitle: "Monster Hunter Wilds",
    source: "game-tracker-seed",
    sourceUrl: "https://github.com/WyattWagner/gameTracker",
  },
};
