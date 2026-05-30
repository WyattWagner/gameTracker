import { z } from "zod";
import { MetadataSchema, RaritySchema, SortOrderSchema } from "./common";

export const DropSchema = z.object({
  id: z.string(),
  gameId: z.string(),
  userId: z.string(),
  sourceMonsterId: z.string(),
  questId: z.string().nullable(),
  dropName: z.string(),
  rarity: RaritySchema,
  quantity: z.number().int().positive(),
  dateObtained: z.string().datetime(),
  metadata: MetadataSchema,
});
export type Drop = z.infer<typeof DropSchema>;

export const CreateDropRequestSchema = z.object({
  gameId: z.string().min(1),
  sourceMonsterId: z.string().min(1),
  questId: z.string().optional(),
  dropName: z.string().min(1),
  rarity: RaritySchema,
  quantity: z.number().int().positive().default(1),
  dateObtained: z.string().datetime().optional(),
  metadata: MetadataSchema,
});
export type CreateDropRequest = z.infer<typeof CreateDropRequestSchema>;

export const UpdateDropRequestSchema = CreateDropRequestSchema.partial();
export type UpdateDropRequest = z.infer<typeof UpdateDropRequestSchema>;

export const ListDropsQuerySchema = z.object({
  gameId: z.string().optional(),
  sourceMonsterId: z.string().optional(),
  search: z.string().optional(),
  sort: z.enum(["dropName", "rarity", "dateObtained", "quantity"]).default("dateObtained"),
  order: SortOrderSchema.default("desc"),
});
export type ListDropsQuery = z.infer<typeof ListDropsQuerySchema>;

export const DropListResponseSchema = z.object({
  drops: z.array(DropSchema),
  total: z.number().int().nonnegative(),
});
export type DropListResponse = z.infer<typeof DropListResponseSchema>;
