"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MetadataSchema = exports.SortOrderSchema = exports.RARITY_RANK = exports.RaritySchema = exports.CompletionStatusSchema = exports.EncounterResultSchema = void 0;
const zod_1 = require("zod");
/** Shared enums keep API + UI aligned and make future game modules extensible. */
exports.EncounterResultSchema = zod_1.z.enum(["WIN", "LOSS", "CAPTURE", "FAILED"]);
exports.CompletionStatusSchema = zod_1.z.enum(["COMPLETED", "FAILED", "IN_PROGRESS"]);
/** Lower rank = rarer. Used for rarest-drop aggregation. */
exports.RaritySchema = zod_1.z.enum(["COMMON", "UNCOMMON", "RARE", "VERY_RARE", "LEGENDARY"]);
exports.RARITY_RANK = {
    COMMON: 5,
    UNCOMMON: 4,
    RARE: 3,
    VERY_RARE: 2,
    LEGENDARY: 1,
};
exports.SortOrderSchema = zod_1.z.enum(["asc", "desc"]);
exports.MetadataSchema = zod_1.z.record(zod_1.z.string(), zod_1.z.unknown()).optional();
//# sourceMappingURL=common.js.map