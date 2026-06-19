"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MonsterListResponseSchema = exports.ListMonstersQuerySchema = exports.UpdateMonsterRequestSchema = exports.CreateMonsterRequestSchema = exports.MonsterSchema = void 0;
const zod_1 = require("zod");
const common_1 = require("./common");
exports.MonsterSchema = zod_1.z.object({
    id: zod_1.z.string(),
    gameId: zod_1.z.string(),
    userId: zod_1.z.string(),
    name: zod_1.z.string(),
    imageUrl: zod_1.z.string().nullable(),
    canBeCaptured: zod_1.z.boolean(),
    favoriteWeaponUsed: zod_1.z.string().nullable(),
    lastEncounterAt: zod_1.z.string().datetime().nullable(),
    numberOfHunts: zod_1.z.number().int().nonnegative(),
    hunts: zod_1.z.number().int().nonnegative(),
    wins: zod_1.z.number().int().nonnegative(),
    losses: zod_1.z.number().int().nonnegative(),
    captures: zod_1.z.number().int().nonnegative(),
    failedQuests: zod_1.z.number().int().nonnegative(),
    notes: zod_1.z.string().nullable(),
    metadata: common_1.MetadataSchema,
});
exports.CreateMonsterRequestSchema = zod_1.z.object({
    gameId: zod_1.z.string().min(1),
    name: zod_1.z.string().min(1),
    imageUrl: zod_1.z.string().url().optional(),
    notes: zod_1.z.string().optional(),
    metadata: common_1.MetadataSchema,
});
exports.UpdateMonsterRequestSchema = exports.CreateMonsterRequestSchema.partial().extend({
    favoriteWeaponUsed: zod_1.z.string().optional(),
    canBeCaptured: zod_1.z.boolean().optional(),
});
exports.ListMonstersQuerySchema = zod_1.z.object({
    gameId: zod_1.z.string().optional(),
    search: zod_1.z.string().optional(),
    sort: zod_1.z.enum(["name", "numberOfHunts", "lastEncounterAt"]).default("name"),
    order: common_1.SortOrderSchema.default("asc"),
});
exports.MonsterListResponseSchema = zod_1.z.object({
    monsters: zod_1.z.array(exports.MonsterSchema),
    total: zod_1.z.number().int().nonnegative(),
});
//# sourceMappingURL=monsters.js.map