import { z } from "zod";
export declare const MonsterSchema: z.ZodObject<{
    id: z.ZodString;
    gameId: z.ZodString;
    userId: z.ZodString;
    name: z.ZodString;
    imageUrl: z.ZodNullable<z.ZodString>;
    canBeCaptured: z.ZodBoolean;
    favoriteWeaponUsed: z.ZodNullable<z.ZodString>;
    lastEncounterAt: z.ZodNullable<z.ZodString>;
    numberOfHunts: z.ZodNumber;
    hunts: z.ZodNumber;
    wins: z.ZodNumber;
    losses: z.ZodNumber;
    captures: z.ZodNumber;
    failedQuests: z.ZodNumber;
    notes: z.ZodNullable<z.ZodString>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
}, z.core.$strip>;
export type Monster = z.infer<typeof MonsterSchema>;
export declare const CreateMonsterRequestSchema: z.ZodObject<{
    gameId: z.ZodString;
    name: z.ZodString;
    imageUrl: z.ZodOptional<z.ZodString>;
    notes: z.ZodOptional<z.ZodString>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
}, z.core.$strip>;
export type CreateMonsterRequest = z.infer<typeof CreateMonsterRequestSchema>;
export declare const UpdateMonsterRequestSchema: z.ZodObject<{
    gameId: z.ZodOptional<z.ZodString>;
    name: z.ZodOptional<z.ZodString>;
    imageUrl: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    notes: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    metadata: z.ZodOptional<z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    favoriteWeaponUsed: z.ZodOptional<z.ZodString>;
    canBeCaptured: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strip>;
export type UpdateMonsterRequest = z.infer<typeof UpdateMonsterRequestSchema>;
export declare const ListMonstersQuerySchema: z.ZodObject<{
    gameId: z.ZodOptional<z.ZodString>;
    search: z.ZodOptional<z.ZodString>;
    sort: z.ZodDefault<z.ZodEnum<{
        name: "name";
        lastEncounterAt: "lastEncounterAt";
        numberOfHunts: "numberOfHunts";
    }>>;
    order: z.ZodDefault<z.ZodEnum<{
        asc: "asc";
        desc: "desc";
    }>>;
}, z.core.$strip>;
export type ListMonstersQuery = z.infer<typeof ListMonstersQuerySchema>;
export declare const MonsterListResponseSchema: z.ZodObject<{
    monsters: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        gameId: z.ZodString;
        userId: z.ZodString;
        name: z.ZodString;
        imageUrl: z.ZodNullable<z.ZodString>;
        canBeCaptured: z.ZodBoolean;
        favoriteWeaponUsed: z.ZodNullable<z.ZodString>;
        lastEncounterAt: z.ZodNullable<z.ZodString>;
        numberOfHunts: z.ZodNumber;
        hunts: z.ZodNumber;
        wins: z.ZodNumber;
        losses: z.ZodNumber;
        captures: z.ZodNumber;
        failedQuests: z.ZodNumber;
        notes: z.ZodNullable<z.ZodString>;
        metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    }, z.core.$strip>>;
    total: z.ZodNumber;
}, z.core.$strip>;
export type MonsterListResponse = z.infer<typeof MonsterListResponseSchema>;
//# sourceMappingURL=monsters.d.ts.map