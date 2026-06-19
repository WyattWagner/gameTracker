"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DropListResponseSchema = exports.ListDropsQuerySchema = exports.UpdateDropRequestSchema = exports.CreateDropRequestSchema = exports.DropSchema = void 0;
const zod_1 = require("zod");
const common_1 = require("./common");
exports.DropSchema = zod_1.z.object({
    id: zod_1.z.string(),
    gameId: zod_1.z.string(),
    userId: zod_1.z.string(),
    sourceMonsterId: zod_1.z.string(),
    questId: zod_1.z.string().nullable(),
    dropName: zod_1.z.string(),
    rarity: common_1.RaritySchema,
    quantity: zod_1.z.number().int().positive(),
    dateObtained: zod_1.z.string().datetime(),
    metadata: common_1.MetadataSchema,
});
exports.CreateDropRequestSchema = zod_1.z.object({
    gameId: zod_1.z.string().min(1),
    sourceMonsterId: zod_1.z.string().min(1),
    questId: zod_1.z.string().optional(),
    dropName: zod_1.z.string().min(1),
    rarity: common_1.RaritySchema,
    quantity: zod_1.z.number().int().positive().default(1),
    dateObtained: zod_1.z.string().datetime().optional(),
    metadata: common_1.MetadataSchema,
});
exports.UpdateDropRequestSchema = exports.CreateDropRequestSchema.partial();
exports.ListDropsQuerySchema = zod_1.z.object({
    gameId: zod_1.z.string().optional(),
    sourceMonsterId: zod_1.z.string().optional(),
    search: zod_1.z.string().optional(),
    sort: zod_1.z.enum(["dropName", "rarity", "dateObtained", "quantity"]).default("dateObtained"),
    order: common_1.SortOrderSchema.default("desc"),
});
exports.DropListResponseSchema = zod_1.z.object({
    drops: zod_1.z.array(exports.DropSchema),
    total: zod_1.z.number().int().nonnegative(),
});
//# sourceMappingURL=drops.js.map