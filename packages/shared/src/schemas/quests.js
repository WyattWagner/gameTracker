"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EncounterSchema = exports.CreateEncounterRequestSchema = exports.QuestListResponseSchema = exports.ListQuestsQuerySchema = exports.UpdateQuestRequestSchema = exports.CreateQuestRequestSchema = exports.QuestSchema = void 0;
const zod_1 = require("zod");
const common_1 = require("./common");
exports.QuestSchema = zod_1.z.object({
    id: zod_1.z.string(),
    gameId: zod_1.z.string(),
    userId: zod_1.z.string(),
    name: zod_1.z.string(),
    completionStatus: common_1.CompletionStatusSchema,
    timeTakenSeconds: zod_1.z.number().int().nonnegative().nullable(),
    cartCount: zod_1.z.number().int().nonnegative(),
    rewards: zod_1.z.string().nullable(),
    notes: zod_1.z.string().nullable(),
    weaponUsed: zod_1.z.string().nullable(),
    isMultiplayer: zod_1.z.boolean(),
    monsterIds: zod_1.z.array(zod_1.z.string()),
    metadata: common_1.MetadataSchema,
});
exports.CreateQuestRequestSchema = zod_1.z.object({
    gameId: zod_1.z.string().min(1),
    name: zod_1.z.string().min(1),
    completionStatus: common_1.CompletionStatusSchema.default("IN_PROGRESS"),
    timeTakenSeconds: zod_1.z.number().int().nonnegative().optional(),
    cartCount: zod_1.z.number().int().nonnegative().default(0),
    rewards: zod_1.z.string().optional(),
    notes: zod_1.z.string().optional(),
    weaponUsed: zod_1.z.string().optional(),
    isMultiplayer: zod_1.z.boolean().default(false),
    monsterIds: zod_1.z.array(zod_1.z.string()).default([]),
    metadata: common_1.MetadataSchema,
});
exports.UpdateQuestRequestSchema = exports.CreateQuestRequestSchema.partial();
exports.ListQuestsQuerySchema = zod_1.z.object({
    gameId: zod_1.z.string().optional(),
    search: zod_1.z.string().optional(),
    completionStatus: common_1.CompletionStatusSchema.optional(),
    sort: zod_1.z.enum(["name", "timeTakenSeconds"]).default("name"),
    order: common_1.SortOrderSchema.default("asc"),
});
exports.QuestListResponseSchema = zod_1.z.object({
    quests: zod_1.z.array(exports.QuestSchema),
    total: zod_1.z.number().int().nonnegative(),
});
exports.CreateEncounterRequestSchema = zod_1.z.object({
    questId: zod_1.z.string().min(1),
    monsterId: zod_1.z.string().min(1),
    result: common_1.EncounterResultSchema,
    encounterDate: zod_1.z.string().datetime().optional(),
    metadata: common_1.MetadataSchema,
});
exports.EncounterSchema = zod_1.z.object({
    id: zod_1.z.string(),
    questId: zod_1.z.string(),
    monsterId: zod_1.z.string(),
    userId: zod_1.z.string(),
    encounterDate: zod_1.z.string().datetime(),
    result: common_1.EncounterResultSchema,
    metadata: common_1.MetadataSchema,
});
//# sourceMappingURL=quests.js.map