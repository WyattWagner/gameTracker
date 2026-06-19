import { z } from "zod";
export declare const DropSchema: z.ZodObject<{
    id: z.ZodString;
    gameId: z.ZodString;
    userId: z.ZodString;
    sourceMonsterId: z.ZodString;
    questId: z.ZodNullable<z.ZodString>;
    dropName: z.ZodString;
    rarity: z.ZodEnum<{
        COMMON: "COMMON";
        UNCOMMON: "UNCOMMON";
        RARE: "RARE";
        VERY_RARE: "VERY_RARE";
        LEGENDARY: "LEGENDARY";
    }>;
    quantity: z.ZodNumber;
    dateObtained: z.ZodString;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
}, z.core.$strip>;
export type Drop = z.infer<typeof DropSchema>;
export declare const CreateDropRequestSchema: z.ZodObject<{
    gameId: z.ZodString;
    sourceMonsterId: z.ZodString;
    questId: z.ZodOptional<z.ZodString>;
    dropName: z.ZodString;
    rarity: z.ZodEnum<{
        COMMON: "COMMON";
        UNCOMMON: "UNCOMMON";
        RARE: "RARE";
        VERY_RARE: "VERY_RARE";
        LEGENDARY: "LEGENDARY";
    }>;
    quantity: z.ZodDefault<z.ZodNumber>;
    dateObtained: z.ZodOptional<z.ZodString>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
}, z.core.$strip>;
export type CreateDropRequest = z.infer<typeof CreateDropRequestSchema>;
export declare const UpdateDropRequestSchema: z.ZodObject<{
    gameId: z.ZodOptional<z.ZodString>;
    sourceMonsterId: z.ZodOptional<z.ZodString>;
    questId: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    dropName: z.ZodOptional<z.ZodString>;
    rarity: z.ZodOptional<z.ZodEnum<{
        COMMON: "COMMON";
        UNCOMMON: "UNCOMMON";
        RARE: "RARE";
        VERY_RARE: "VERY_RARE";
        LEGENDARY: "LEGENDARY";
    }>>;
    quantity: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
    dateObtained: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    metadata: z.ZodOptional<z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
}, z.core.$strip>;
export type UpdateDropRequest = z.infer<typeof UpdateDropRequestSchema>;
export declare const ListDropsQuerySchema: z.ZodObject<{
    gameId: z.ZodOptional<z.ZodString>;
    sourceMonsterId: z.ZodOptional<z.ZodString>;
    search: z.ZodOptional<z.ZodString>;
    sort: z.ZodDefault<z.ZodEnum<{
        rarity: "rarity";
        dropName: "dropName";
        quantity: "quantity";
        dateObtained: "dateObtained";
    }>>;
    order: z.ZodDefault<z.ZodEnum<{
        asc: "asc";
        desc: "desc";
    }>>;
}, z.core.$strip>;
export type ListDropsQuery = z.infer<typeof ListDropsQuerySchema>;
export declare const DropListResponseSchema: z.ZodObject<{
    drops: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        gameId: z.ZodString;
        userId: z.ZodString;
        sourceMonsterId: z.ZodString;
        questId: z.ZodNullable<z.ZodString>;
        dropName: z.ZodString;
        rarity: z.ZodEnum<{
            COMMON: "COMMON";
            UNCOMMON: "UNCOMMON";
            RARE: "RARE";
            VERY_RARE: "VERY_RARE";
            LEGENDARY: "LEGENDARY";
        }>;
        quantity: z.ZodNumber;
        dateObtained: z.ZodString;
        metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    }, z.core.$strip>>;
    total: z.ZodNumber;
}, z.core.$strip>;
export type DropListResponse = z.infer<typeof DropListResponseSchema>;
//# sourceMappingURL=drops.d.ts.map