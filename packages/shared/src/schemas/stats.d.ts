import { z } from "zod";
import { EncounterResultSchema } from "./common";
export declare const DashboardQuerySchema: z.ZodObject<{
    gameId: z.ZodOptional<z.ZodString>;
    from: z.ZodOptional<z.ZodString>;
    to: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type DashboardQuery = z.infer<typeof DashboardQuerySchema>;
export declare const RecentActivitySchema: z.ZodObject<{
    id: z.ZodString;
    type: z.ZodEnum<{
        ENCOUNTER: "ENCOUNTER";
        DROP: "DROP";
        QUEST: "QUEST";
    }>;
    summary: z.ZodString;
    occurredAt: z.ZodString;
}, z.core.$strip>;
export type RecentActivity = z.infer<typeof RecentActivitySchema>;
export declare const DashboardStatsSchema: z.ZodObject<{
    totalQuestsCompleted: z.ZodNumber;
    totalQuestsAccepted: z.ZodNumber;
    totalHunts: z.ZodNumber;
    monstersDefeated: z.ZodNumber;
    monstersCaptured: z.ZodNumber;
    monstersFailedAgainst: z.ZodNumber;
    mostHuntedMonster: z.ZodNullable<z.ZodObject<{
        id: z.ZodString;
        name: z.ZodString;
        hunts: z.ZodNumber;
    }, z.core.$strip>>;
    rarestDropObtained: z.ZodNullable<z.ZodObject<{
        id: z.ZodString;
        dropName: z.ZodString;
        rarity: z.ZodEnum<{
            COMMON: "COMMON";
            UNCOMMON: "UNCOMMON";
            RARE: "RARE";
            VERY_RARE: "VERY_RARE";
            LEGENDARY: "LEGENDARY";
        }>;
    }, z.core.$strip>>;
    recentActivity: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        type: z.ZodEnum<{
            ENCOUNTER: "ENCOUNTER";
            DROP: "DROP";
            QUEST: "QUEST";
        }>;
        summary: z.ZodString;
        occurredAt: z.ZodString;
    }, z.core.$strip>>;
}, z.core.$strip>;
export type DashboardStats = z.infer<typeof DashboardStatsSchema>;
export declare const DropAggregationSchema: z.ZodObject<{
    totalMaterialsCollected: z.ZodNumber;
    rarestMaterials: z.ZodArray<z.ZodObject<{
        dropName: z.ZodString;
        rarity: z.ZodEnum<{
            COMMON: "COMMON";
            UNCOMMON: "UNCOMMON";
            RARE: "RARE";
            VERY_RARE: "VERY_RARE";
            LEGENDARY: "LEGENDARY";
        }>;
        totalQuantity: z.ZodNumber;
    }, z.core.$strip>>;
    mostFrequentMaterials: z.ZodArray<z.ZodObject<{
        dropName: z.ZodString;
        totalQuantity: z.ZodNumber;
    }, z.core.$strip>>;
}, z.core.$strip>;
export type DropAggregation = z.infer<typeof DropAggregationSchema>;
/** Used when recording encounters to keep monster counters in sync. */
export declare const ENCOUNTER_RESULT_TO_MONSTER_FIELD: Record<z.infer<typeof EncounterResultSchema>, "wins" | "captures" | "failedQuests">;
//# sourceMappingURL=stats.d.ts.map