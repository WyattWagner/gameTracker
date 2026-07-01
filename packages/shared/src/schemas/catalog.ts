import { z } from "zod";
import { BodyPartWeaknessRowSchema } from "./monster-database";

export const CatalogExpansionSchema = z.enum(["base", "iceborne", "sunbreak"]);

export const ElementalWeaknessSchema = z.object({
  element: z.string(),
  stars: z.number().int().min(0).max(3),
});

export const AilmentWeaknessSchema = z.object({
  ailment: z.string(),
  stars: z.number().int().min(0).max(3),
  resistance: z.number().int().min(0).max(100),
});

export const MonsterCatalogEntrySchema = z.object({
  id: z.string(),
  source: z.string(),
  sourceId: z.number().int(),
  name: z.string(),
  type: z.enum(["large", "small"]),
  species: z.string().nullable(),
  description: z.string().nullable(),
  elements: z.array(z.string()),
  ailments: z.array(z.string()),
  locations: z.array(z.string()),
  elementalWeaknesses: z.array(ElementalWeaknessSchema),
  ailmentWeaknesses: z.array(AilmentWeaknessSchema),
  bodyPartWeaknesses: z.array(BodyPartWeaknessRowSchema).optional(),
  expansion: CatalogExpansionSchema.optional(),
  canBeCaptured: z.boolean(),
});
export type MonsterCatalogEntry = z.infer<typeof MonsterCatalogEntrySchema>;

export const MonsterCatalogListResponseSchema = z.object({
  monsters: z.array(MonsterCatalogEntrySchema),
  total: z.number().int().nonnegative(),
  page: z.number().int().positive().optional(),
  pageSize: z.number().int().positive().optional(),
  gameTitle: z.string(),
  source: z.string(),
  sourceUrl: z.string().url(),
});
export type MonsterCatalogListResponse = z.infer<typeof MonsterCatalogListResponseSchema>;

export const ListCatalogQuerySchema = z.object({
  gameId: z.string().default("monster-hunter"),
  search: z.string().optional(),
  type: z.enum(["large", "small", "all"]).default("all"),
  monsterType: z.string().optional(),
  weaknessElement: z.enum(["fire", "water", "thunder", "ice", "dragon"]).optional(),
  rank: z.enum(["LOW", "HIGH", "MASTER"]).optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(50),
});
export type ListCatalogQuery = z.infer<typeof ListCatalogQuerySchema>;

export const CreateMonsterFromCatalogSchema = z.object({
  gameId: z.string().min(1),
  catalogId: z.string().min(1),
});
export type CreateMonsterFromCatalogRequest = z.infer<typeof CreateMonsterFromCatalogSchema>;
