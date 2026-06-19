"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZERO_AILMENT_BARS = exports.DEFAULT_MH_BODY_PARTS = exports.DEFAULT_MH_AILMENTS = exports.AddMaterialBodyPartDropSchema = exports.InitializeRankSchema = exports.UpdateMaterialSchema = exports.CreateMaterialSchema = exports.UpdateAilmentSchema = exports.CreateAilmentSchema = exports.PatchWeaknessSchema = exports.UpdateBodyPartSchema = exports.CreateBodyPartSchema = exports.PatchMonsterStatsSchema = exports.MonsterHunterDetailSchema = exports.MonsterMaterialSchema = exports.MaterialBodyPartDropSchema = exports.MonsterAilmentSchema = exports.WeaknessEntrySchema = exports.MonsterBodyPartSchema = exports.PercentValueSchema = exports.WeaknessValueSchema = exports.ResistanceValueSchema = exports.MaterialRankSchema = void 0;
const zod_1 = require("zod");
exports.MaterialRankSchema = zod_1.z.enum(["LOW", "HIGH", "MASTER"]);
exports.ResistanceValueSchema = zod_1.z.union([
    zod_1.z.literal(0),
    zod_1.z.literal(25),
    zod_1.z.literal(50),
    zod_1.z.literal(75),
    zod_1.z.literal(100),
]);
exports.WeaknessValueSchema = zod_1.z.number().int().min(0).max(99);
exports.PercentValueSchema = zod_1.z.number().int().min(0).max(100);
exports.MonsterBodyPartSchema = zod_1.z.object({
    id: zod_1.z.string(),
    monsterId: zod_1.z.string(),
    name: zod_1.z.string().min(1),
    sortOrder: zod_1.z.number().int(),
});
exports.WeaknessEntrySchema = zod_1.z.object({
    id: zod_1.z.string(),
    monsterId: zod_1.z.string(),
    bodyPartId: zod_1.z.string(),
    slash: exports.WeaknessValueSchema,
    blunt: exports.WeaknessValueSchema,
    pierce: exports.WeaknessValueSchema,
    fire: exports.WeaknessValueSchema,
    water: exports.WeaknessValueSchema,
    thunder: exports.WeaknessValueSchema,
    ice: exports.WeaknessValueSchema,
    dragon: exports.WeaknessValueSchema,
});
exports.MonsterAilmentSchema = zod_1.z.object({
    id: zod_1.z.string(),
    monsterId: zod_1.z.string(),
    name: zod_1.z.string().min(1),
    isCustom: zod_1.z.boolean(),
    initialResistance: zod_1.z.number().int().min(0).max(100),
    nextResistanceThreshold: zod_1.z.number().int().min(0).max(100),
    maximumResistance: zod_1.z.number().int().min(0).max(100),
    naturalBuildUpDegradation: zod_1.z.number().int().min(0).max(100),
    totalEffectiveness: zod_1.z.number().int().min(0).max(100),
    sortOrder: zod_1.z.number().int(),
    starRating: zod_1.z.union([zod_1.z.literal(0), zod_1.z.literal(1), zod_1.z.literal(2), zod_1.z.literal(3)]).optional(),
});
exports.MaterialBodyPartDropSchema = zod_1.z.object({
    id: zod_1.z.string(),
    materialId: zod_1.z.string(),
    bodyPartId: zod_1.z.string(),
    chance: exports.PercentValueSchema,
});
exports.MonsterMaterialSchema = zod_1.z.object({
    id: zod_1.z.string(),
    monsterId: zod_1.z.string(),
    rank: exports.MaterialRankSchema,
    name: zod_1.z.string().min(1),
    targetReward: exports.PercentValueSchema,
    captureReward: exports.PercentValueSchema,
    brokenPartReward: exports.PercentValueSchema,
    carveReward: exports.PercentValueSchema,
    dropMaterialReward: exports.PercentValueSchema,
    sortOrder: zod_1.z.number().int(),
    bodyPartDrops: zod_1.z.array(exports.MaterialBodyPartDropSchema),
});
exports.MonsterHunterDetailSchema = zod_1.z.object({
    bodyParts: zod_1.z.array(exports.MonsterBodyPartSchema),
    weaknesses: zod_1.z.array(exports.WeaknessEntrySchema),
    ailments: zod_1.z.array(exports.MonsterAilmentSchema),
    materials: zod_1.z.array(exports.MonsterMaterialSchema),
});
exports.PatchMonsterStatsSchema = zod_1.z
    .object({
    numberOfHunts: zod_1.z.number().int().nonnegative().optional(),
    hunts: zod_1.z.number().int().nonnegative().optional(),
    wins: zod_1.z.number().int().nonnegative().optional(),
    losses: zod_1.z.number().int().nonnegative().optional(),
    captures: zod_1.z.number().int().nonnegative().optional(),
    failedQuests: zod_1.z.number().int().nonnegative().optional(),
    deltas: zod_1.z
        .object({
        numberOfHunts: zod_1.z.number().int().optional(),
        hunts: zod_1.z.number().int().optional(),
        wins: zod_1.z.number().int().optional(),
        losses: zod_1.z.number().int().optional(),
        captures: zod_1.z.number().int().optional(),
        failedQuests: zod_1.z.number().int().optional(),
    })
        .optional(),
})
    .refine((v) => Object.keys(v).length > 0, { message: "At least one stat field required" });
exports.CreateBodyPartSchema = zod_1.z.object({ name: zod_1.z.string().min(1), sortOrder: zod_1.z.number().int().optional() });
exports.UpdateBodyPartSchema = zod_1.z.object({ name: zod_1.z.string().min(1).optional(), sortOrder: zod_1.z.number().int().optional() });
exports.PatchWeaknessSchema = zod_1.z.object({
    bodyPartId: zod_1.z.string(),
    slash: exports.WeaknessValueSchema.optional(),
    blunt: exports.WeaknessValueSchema.optional(),
    pierce: exports.WeaknessValueSchema.optional(),
    fire: exports.WeaknessValueSchema.optional(),
    water: exports.WeaknessValueSchema.optional(),
    thunder: exports.WeaknessValueSchema.optional(),
    ice: exports.WeaknessValueSchema.optional(),
    dragon: exports.WeaknessValueSchema.optional(),
});
exports.CreateAilmentSchema = zod_1.z.object({
    name: zod_1.z.string().min(1),
    isCustom: zod_1.z.boolean().optional(),
    initialResistance: zod_1.z.number().int().min(0).max(100).optional(),
    nextResistanceThreshold: zod_1.z.number().int().min(0).max(100).optional(),
    maximumResistance: zod_1.z.number().int().min(0).max(100).optional(),
    naturalBuildUpDegradation: zod_1.z.number().int().min(0).max(100).optional(),
    totalEffectiveness: zod_1.z.number().int().min(0).max(100).optional(),
});
exports.UpdateAilmentSchema = exports.CreateAilmentSchema.partial().extend({ name: zod_1.z.string().min(1).optional() });
exports.CreateMaterialSchema = zod_1.z.object({
    rank: exports.MaterialRankSchema,
    name: zod_1.z.string().min(1),
    targetReward: exports.PercentValueSchema.optional(),
    captureReward: exports.PercentValueSchema.optional(),
    brokenPartReward: exports.PercentValueSchema.optional(),
    carveReward: exports.PercentValueSchema.optional(),
    dropMaterialReward: exports.PercentValueSchema.optional(),
});
exports.UpdateMaterialSchema = exports.CreateMaterialSchema.partial();
exports.InitializeRankSchema = zod_1.z.object({
    from: exports.MaterialRankSchema,
    to: exports.MaterialRankSchema,
});
exports.AddMaterialBodyPartDropSchema = zod_1.z.object({
    bodyPartId: zod_1.z.string(),
    chance: exports.PercentValueSchema,
});
exports.DEFAULT_MH_AILMENTS = [
    "Poison",
    "Stun",
    "Paralysis",
    "Sleep",
    "Blast",
    "Exhaust",
    "Fireblight",
    "Waterblight",
    "Thunderblight",
    "Iceblight",
];
exports.DEFAULT_MH_BODY_PARTS = ["Head", "Neck", "Body", "Wing", "Foreleg", "Hind Leg", "Tail"];
/** All resistance bars at 0% — used when catalog/game data has no entry for an ailment. */
exports.ZERO_AILMENT_BARS = {
    initialResistance: 0,
    nextResistanceThreshold: 0,
    maximumResistance: 0,
    naturalBuildUpDegradation: 0,
    totalEffectiveness: 0,
};
//# sourceMappingURL=monster-hunter.js.map