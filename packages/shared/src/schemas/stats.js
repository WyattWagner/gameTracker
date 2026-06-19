"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ENCOUNTER_RESULT_TO_MONSTER_FIELD = exports.DropAggregationSchema = exports.DashboardStatsSchema = exports.RecentActivitySchema = exports.DashboardQuerySchema = void 0;
const zod_1 = require("zod");
const common_1 = require("./common");
exports.DashboardQuerySchema = zod_1.z.object({
    gameId: zod_1.z.string().optional(),
    from: zod_1.z.string().datetime().optional(),
    to: zod_1.z.string().datetime().optional(),
});
exports.RecentActivitySchema = zod_1.z.object({
    id: zod_1.z.string(),
    type: zod_1.z.enum(["ENCOUNTER", "DROP", "QUEST"]),
    summary: zod_1.z.string(),
    occurredAt: zod_1.z.string().datetime(),
});
exports.DashboardStatsSchema = zod_1.z.object({
    totalQuestsCompleted: zod_1.z.number().int().nonnegative(),
    totalQuestsAccepted: zod_1.z.number().int().nonnegative(),
    totalHunts: zod_1.z.number().int().nonnegative(),
    monstersDefeated: zod_1.z.number().int().nonnegative(),
    monstersCaptured: zod_1.z.number().int().nonnegative(),
    monstersFailedAgainst: zod_1.z.number().int().nonnegative(),
    mostHuntedMonster: zod_1.z
        .object({
        id: zod_1.z.string(),
        name: zod_1.z.string(),
        hunts: zod_1.z.number().int().nonnegative(),
    })
        .nullable(),
    rarestDropObtained: zod_1.z
        .object({
        id: zod_1.z.string(),
        dropName: zod_1.z.string(),
        rarity: common_1.RaritySchema,
    })
        .nullable(),
    recentActivity: zod_1.z.array(exports.RecentActivitySchema),
});
exports.DropAggregationSchema = zod_1.z.object({
    totalMaterialsCollected: zod_1.z.number().int().nonnegative(),
    rarestMaterials: zod_1.z.array(zod_1.z.object({
        dropName: zod_1.z.string(),
        rarity: common_1.RaritySchema,
        totalQuantity: zod_1.z.number().int().nonnegative(),
    })),
    mostFrequentMaterials: zod_1.z.array(zod_1.z.object({
        dropName: zod_1.z.string(),
        totalQuantity: zod_1.z.number().int().nonnegative(),
    })),
});
/** Used when recording encounters to keep monster counters in sync. */
exports.ENCOUNTER_RESULT_TO_MONSTER_FIELD = {
    WIN: "wins",
    LOSS: "failedQuests",
    CAPTURE: "captures",
    FAILED: "failedQuests",
};
//# sourceMappingURL=stats.js.map