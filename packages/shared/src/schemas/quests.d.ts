import { z } from "zod";
export declare const QuestSchema: z.ZodObject<{
    id: z.ZodString;
    gameId: z.ZodString;
    userId: z.ZodString;
    name: z.ZodString;
    completionStatus: z.ZodEnum<{
        FAILED: "FAILED";
        COMPLETED: "COMPLETED";
        IN_PROGRESS: "IN_PROGRESS";
    }>;
    timeTakenSeconds: z.ZodNullable<z.ZodNumber>;
    cartCount: z.ZodNumber;
    rewards: z.ZodNullable<z.ZodString>;
    notes: z.ZodNullable<z.ZodString>;
    weaponUsed: z.ZodNullable<z.ZodString>;
    isMultiplayer: z.ZodBoolean;
    monsterIds: z.ZodArray<z.ZodString>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
}, z.core.$strip>;
export type Quest = z.infer<typeof QuestSchema>;
export declare const CreateQuestRequestSchema: z.ZodObject<{
    gameId: z.ZodString;
    name: z.ZodString;
    completionStatus: z.ZodDefault<z.ZodEnum<{
        FAILED: "FAILED";
        COMPLETED: "COMPLETED";
        IN_PROGRESS: "IN_PROGRESS";
    }>>;
    timeTakenSeconds: z.ZodOptional<z.ZodNumber>;
    cartCount: z.ZodDefault<z.ZodNumber>;
    rewards: z.ZodOptional<z.ZodString>;
    notes: z.ZodOptional<z.ZodString>;
    weaponUsed: z.ZodOptional<z.ZodString>;
    isMultiplayer: z.ZodDefault<z.ZodBoolean>;
    monsterIds: z.ZodDefault<z.ZodArray<z.ZodString>>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
}, z.core.$strip>;
export type CreateQuestRequest = z.infer<typeof CreateQuestRequestSchema>;
export declare const UpdateQuestRequestSchema: z.ZodObject<{
    gameId: z.ZodOptional<z.ZodString>;
    name: z.ZodOptional<z.ZodString>;
    completionStatus: z.ZodOptional<z.ZodDefault<z.ZodEnum<{
        FAILED: "FAILED";
        COMPLETED: "COMPLETED";
        IN_PROGRESS: "IN_PROGRESS";
    }>>>;
    timeTakenSeconds: z.ZodOptional<z.ZodOptional<z.ZodNumber>>;
    cartCount: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
    rewards: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    notes: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    weaponUsed: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    isMultiplayer: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
    monsterIds: z.ZodOptional<z.ZodDefault<z.ZodArray<z.ZodString>>>;
    metadata: z.ZodOptional<z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
}, z.core.$strip>;
export type UpdateQuestRequest = z.infer<typeof UpdateQuestRequestSchema>;
export declare const ListQuestsQuerySchema: z.ZodObject<{
    gameId: z.ZodOptional<z.ZodString>;
    search: z.ZodOptional<z.ZodString>;
    completionStatus: z.ZodOptional<z.ZodEnum<{
        FAILED: "FAILED";
        COMPLETED: "COMPLETED";
        IN_PROGRESS: "IN_PROGRESS";
    }>>;
    sort: z.ZodDefault<z.ZodEnum<{
        name: "name";
        timeTakenSeconds: "timeTakenSeconds";
    }>>;
    order: z.ZodDefault<z.ZodEnum<{
        asc: "asc";
        desc: "desc";
    }>>;
}, z.core.$strip>;
export type ListQuestsQuery = z.infer<typeof ListQuestsQuerySchema>;
export declare const QuestListResponseSchema: z.ZodObject<{
    quests: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        gameId: z.ZodString;
        userId: z.ZodString;
        name: z.ZodString;
        completionStatus: z.ZodEnum<{
            FAILED: "FAILED";
            COMPLETED: "COMPLETED";
            IN_PROGRESS: "IN_PROGRESS";
        }>;
        timeTakenSeconds: z.ZodNullable<z.ZodNumber>;
        cartCount: z.ZodNumber;
        rewards: z.ZodNullable<z.ZodString>;
        notes: z.ZodNullable<z.ZodString>;
        weaponUsed: z.ZodNullable<z.ZodString>;
        isMultiplayer: z.ZodBoolean;
        monsterIds: z.ZodArray<z.ZodString>;
        metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    }, z.core.$strip>>;
    total: z.ZodNumber;
}, z.core.$strip>;
export type QuestListResponse = z.infer<typeof QuestListResponseSchema>;
export declare const CreateEncounterRequestSchema: z.ZodObject<{
    questId: z.ZodString;
    monsterId: z.ZodString;
    result: z.ZodEnum<{
        WIN: "WIN";
        LOSS: "LOSS";
        CAPTURE: "CAPTURE";
        FAILED: "FAILED";
    }>;
    encounterDate: z.ZodOptional<z.ZodString>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
}, z.core.$strip>;
export type CreateEncounterRequest = z.infer<typeof CreateEncounterRequestSchema>;
export declare const EncounterSchema: z.ZodObject<{
    id: z.ZodString;
    questId: z.ZodString;
    monsterId: z.ZodString;
    userId: z.ZodString;
    encounterDate: z.ZodString;
    result: z.ZodEnum<{
        WIN: "WIN";
        LOSS: "LOSS";
        CAPTURE: "CAPTURE";
        FAILED: "FAILED";
    }>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
}, z.core.$strip>;
export type Encounter = z.infer<typeof EncounterSchema>;
//# sourceMappingURL=quests.d.ts.map