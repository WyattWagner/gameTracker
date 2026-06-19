"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateMonsterFromCatalogSchema = exports.ListCatalogQuerySchema = exports.MonsterCatalogListResponseSchema = exports.MonsterCatalogEntrySchema = exports.AilmentWeaknessSchema = exports.ElementalWeaknessSchema = void 0;
const zod_1 = require("zod");
exports.ElementalWeaknessSchema = zod_1.z.object({
    element: zod_1.z.string(),
    stars: zod_1.z.number().int().min(0).max(3),
});
exports.AilmentWeaknessSchema = zod_1.z.object({
    ailment: zod_1.z.string(),
    stars: zod_1.z.number().int().min(0).max(3),
    resistance: zod_1.z.number().int().min(0).max(100),
});
exports.MonsterCatalogEntrySchema = zod_1.z.object({
    id: zod_1.z.string(),
    source: zod_1.z.string(),
    sourceId: zod_1.z.number().int(),
    name: zod_1.z.string(),
    type: zod_1.z.enum(["large", "small"]),
    species: zod_1.z.string().nullable(),
    description: zod_1.z.string().nullable(),
    elements: zod_1.z.array(zod_1.z.string()),
    ailments: zod_1.z.array(zod_1.z.string()),
    locations: zod_1.z.array(zod_1.z.string()),
    elementalWeaknesses: zod_1.z.array(exports.ElementalWeaknessSchema),
    ailmentWeaknesses: zod_1.z.array(exports.AilmentWeaknessSchema),
    canBeCaptured: zod_1.z.boolean(),
});
exports.MonsterCatalogListResponseSchema = zod_1.z.object({
    monsters: zod_1.z.array(exports.MonsterCatalogEntrySchema),
    total: zod_1.z.number().int().nonnegative(),
    gameTitle: zod_1.z.string(),
    source: zod_1.z.string(),
    sourceUrl: zod_1.z.string().url(),
});
exports.ListCatalogQuerySchema = zod_1.z.object({
    gameId: zod_1.z.string().default("monster-hunter"),
    search: zod_1.z.string().optional(),
    type: zod_1.z.enum(["large", "small", "all"]).default("all"),
});
exports.CreateMonsterFromCatalogSchema = zod_1.z.object({
    gameId: zod_1.z.string().min(1),
    catalogId: zod_1.z.string().min(1),
});
//# sourceMappingURL=catalog.js.map