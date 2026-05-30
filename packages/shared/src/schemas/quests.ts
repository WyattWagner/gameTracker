import { z } from "zod";
import { CompletionStatusSchema, EncounterResultSchema, MetadataSchema, SortOrderSchema } from "./common";

export const QuestSchema = z.object({
  id: z.string(),
  gameId: z.string(),
  userId: z.string(),
  name: z.string(),
  completionStatus: CompletionStatusSchema,
  timeTakenSeconds: z.number().int().nonnegative().nullable(),
  cartCount: z.number().int().nonnegative(),
  rewards: z.string().nullable(),
  notes: z.string().nullable(),
  weaponUsed: z.string().nullable(),
  isMultiplayer: z.boolean(),
  monsterIds: z.array(z.string()),
  metadata: MetadataSchema,
});
export type Quest = z.infer<typeof QuestSchema>;

export const CreateQuestRequestSchema = z.object({
  gameId: z.string().min(1),
  name: z.string().min(1),
  completionStatus: CompletionStatusSchema.default("IN_PROGRESS"),
  timeTakenSeconds: z.number().int().nonnegative().optional(),
  cartCount: z.number().int().nonnegative().default(0),
  rewards: z.string().optional(),
  notes: z.string().optional(),
  weaponUsed: z.string().optional(),
  isMultiplayer: z.boolean().default(false),
  monsterIds: z.array(z.string()).default([]),
  metadata: MetadataSchema,
});
export type CreateQuestRequest = z.infer<typeof CreateQuestRequestSchema>;

export const UpdateQuestRequestSchema = CreateQuestRequestSchema.partial();
export type UpdateQuestRequest = z.infer<typeof UpdateQuestRequestSchema>;

export const ListQuestsQuerySchema = z.object({
  gameId: z.string().optional(),
  search: z.string().optional(),
  completionStatus: CompletionStatusSchema.optional(),
  sort: z.enum(["name", "timeTakenSeconds"]).default("name"),
  order: SortOrderSchema.default("asc"),
});
export type ListQuestsQuery = z.infer<typeof ListQuestsQuerySchema>;

export const QuestListResponseSchema = z.object({
  quests: z.array(QuestSchema),
  total: z.number().int().nonnegative(),
});
export type QuestListResponse = z.infer<typeof QuestListResponseSchema>;

export const CreateEncounterRequestSchema = z.object({
  questId: z.string().min(1),
  monsterId: z.string().min(1),
  result: EncounterResultSchema,
  encounterDate: z.string().datetime().optional(),
  metadata: MetadataSchema,
});
export type CreateEncounterRequest = z.infer<typeof CreateEncounterRequestSchema>;

export const EncounterSchema = z.object({
  id: z.string(),
  questId: z.string(),
  monsterId: z.string(),
  userId: z.string(),
  encounterDate: z.string().datetime(),
  result: EncounterResultSchema,
  metadata: MetadataSchema,
});
export type Encounter = z.infer<typeof EncounterSchema>;
