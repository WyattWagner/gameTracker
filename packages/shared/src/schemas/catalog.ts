import { z } from "zod";

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
  canBeCaptured: z.boolean(),
});
export type MonsterCatalogEntry = z.infer<typeof MonsterCatalogEntrySchema>;

export const MonsterCatalogListResponseSchema = z.object({
  monsters: z.array(MonsterCatalogEntrySchema),
  total: z.number().int().nonnegative(),
  gameTitle: z.string(),
  source: z.string(),
  sourceUrl: z.string().url(),
});
export type MonsterCatalogListResponse = z.infer<typeof MonsterCatalogListResponseSchema>;

export const ListCatalogQuerySchema = z.object({
  gameId: z.string().default("monster-hunter"),
  search: z.string().optional(),
  type: z.enum(["large", "small", "all"]).default("all"),
});
export type ListCatalogQuery = z.infer<typeof ListCatalogQuerySchema>;

export const CreateMonsterFromCatalogSchema = z.object({
  gameId: z.string().min(1),
  catalogId: z.string().min(1),
});
export type CreateMonsterFromCatalogRequest = z.infer<typeof CreateMonsterFromCatalogSchema>;
