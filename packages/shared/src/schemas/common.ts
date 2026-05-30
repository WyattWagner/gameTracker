import { z } from "zod";

/** Shared enums keep API + UI aligned and make future game modules extensible. */
export const EncounterResultSchema = z.enum(["WIN", "LOSS", "CAPTURE", "FAILED"]);
export type EncounterResult = z.infer<typeof EncounterResultSchema>;

export const CompletionStatusSchema = z.enum(["COMPLETED", "FAILED", "IN_PROGRESS"]);
export type CompletionStatus = z.infer<typeof CompletionStatusSchema>;

/** Lower rank = rarer. Used for rarest-drop aggregation. */
export const RaritySchema = z.enum(["COMMON", "UNCOMMON", "RARE", "VERY_RARE", "LEGENDARY"]);
export type Rarity = z.infer<typeof RaritySchema>;

export const RARITY_RANK: Record<Rarity, number> = {
  COMMON: 5,
  UNCOMMON: 4,
  RARE: 3,
  VERY_RARE: 2,
  LEGENDARY: 1,
};

export const SortOrderSchema = z.enum(["asc", "desc"]);
export type SortOrder = z.infer<typeof SortOrderSchema>;

export const MetadataSchema = z.record(z.string(), z.unknown()).optional();
