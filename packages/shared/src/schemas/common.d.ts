import { z } from "zod";
/** Shared enums keep API + UI aligned and make future game modules extensible. */
export declare const EncounterResultSchema: z.ZodEnum<{
    WIN: "WIN";
    LOSS: "LOSS";
    CAPTURE: "CAPTURE";
    FAILED: "FAILED";
}>;
export type EncounterResult = z.infer<typeof EncounterResultSchema>;
export declare const CompletionStatusSchema: z.ZodEnum<{
    FAILED: "FAILED";
    COMPLETED: "COMPLETED";
    IN_PROGRESS: "IN_PROGRESS";
}>;
export type CompletionStatus = z.infer<typeof CompletionStatusSchema>;
/** Lower rank = rarer. Used for rarest-drop aggregation. */
export declare const RaritySchema: z.ZodEnum<{
    COMMON: "COMMON";
    UNCOMMON: "UNCOMMON";
    RARE: "RARE";
    VERY_RARE: "VERY_RARE";
    LEGENDARY: "LEGENDARY";
}>;
export type Rarity = z.infer<typeof RaritySchema>;
export declare const RARITY_RANK: Record<Rarity, number>;
export declare const SortOrderSchema: z.ZodEnum<{
    asc: "asc";
    desc: "desc";
}>;
export type SortOrder = z.infer<typeof SortOrderSchema>;
export declare const MetadataSchema: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
//# sourceMappingURL=common.d.ts.map