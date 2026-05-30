import { z } from "zod";
import { MetadataSchema, SortOrderSchema } from "./common";

export const MonsterSchema = z.object({
  id: z.string(),
  gameId: z.string(),
  userId: z.string(),
  name: z.string(),
  imageUrl: z.string().nullable(),
  favoriteWeaponUsed: z.string().nullable(),
  lastEncounterAt: z.string().datetime().nullable(),
  numberOfHunts: z.number().int().nonnegative(),
  wins: z.number().int().nonnegative(),
  losses: z.number().int().nonnegative(),
  captures: z.number().int().nonnegative(),
  failedQuests: z.number().int().nonnegative(),
  notes: z.string().nullable(),
  metadata: MetadataSchema,
});
export type Monster = z.infer<typeof MonsterSchema>;

export const CreateMonsterRequestSchema = z.object({
  gameId: z.string().min(1),
  name: z.string().min(1),
  imageUrl: z.string().url().optional(),
  notes: z.string().optional(),
  metadata: MetadataSchema,
});
export type CreateMonsterRequest = z.infer<typeof CreateMonsterRequestSchema>;

export const UpdateMonsterRequestSchema = CreateMonsterRequestSchema.partial().extend({
  favoriteWeaponUsed: z.string().optional(),
});
export type UpdateMonsterRequest = z.infer<typeof UpdateMonsterRequestSchema>;

export const ListMonstersQuerySchema = z.object({
  gameId: z.string().optional(),
  search: z.string().optional(),
  sort: z.enum(["name", "numberOfHunts", "lastEncounterAt"]).default("name"),
  order: SortOrderSchema.default("asc"),
});
export type ListMonstersQuery = z.infer<typeof ListMonstersQuerySchema>;

export const MonsterListResponseSchema = z.object({
  monsters: z.array(MonsterSchema),
  total: z.number().int().nonnegative(),
});
export type MonsterListResponse = z.infer<typeof MonsterListResponseSchema>;
