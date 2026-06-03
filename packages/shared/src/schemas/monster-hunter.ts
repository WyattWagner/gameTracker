import { z } from "zod";

export const MaterialRankSchema = z.enum(["LOW", "HIGH", "MASTER"]);
export type MaterialRank = z.infer<typeof MaterialRankSchema>;

export const ResistanceValueSchema = z.union([
  z.literal(0),
  z.literal(25),
  z.literal(50),
  z.literal(75),
  z.literal(100),
]);

export const WeaknessValueSchema = z.number().int().min(0).max(99);
export const PercentValueSchema = z.number().int().min(0).max(100);

export const MonsterBodyPartSchema = z.object({
  id: z.string(),
  monsterId: z.string(),
  name: z.string().min(1),
  sortOrder: z.number().int(),
});
export type MonsterBodyPart = z.infer<typeof MonsterBodyPartSchema>;

export const WeaknessEntrySchema = z.object({
  id: z.string(),
  monsterId: z.string(),
  bodyPartId: z.string(),
  slash: WeaknessValueSchema,
  blunt: WeaknessValueSchema,
  pierce: WeaknessValueSchema,
  fire: WeaknessValueSchema,
  water: WeaknessValueSchema,
  thunder: WeaknessValueSchema,
  ice: WeaknessValueSchema,
  dragon: WeaknessValueSchema,
});
export type WeaknessEntry = z.infer<typeof WeaknessEntrySchema>;

export const MonsterAilmentSchema = z.object({
  id: z.string(),
  monsterId: z.string(),
  name: z.string().min(1),
  isCustom: z.boolean(),
  initialResistance: z.number().int().min(0).max(100),
  nextResistanceThreshold: z.number().int().min(0).max(100),
  maximumResistance: z.number().int().min(0).max(100),
  naturalBuildUpDegradation: z.number().int().min(0).max(100),
  totalEffectiveness: z.number().int().min(0).max(100),
  sortOrder: z.number().int(),
  starRating: z.union([z.literal(0), z.literal(1), z.literal(2), z.literal(3)]).optional(),
});
export type MonsterAilment = z.infer<typeof MonsterAilmentSchema>;

export const MaterialBodyPartDropSchema = z.object({
  id: z.string(),
  materialId: z.string(),
  bodyPartId: z.string(),
  chance: PercentValueSchema,
});
export type MaterialBodyPartDrop = z.infer<typeof MaterialBodyPartDropSchema>;

export const MonsterMaterialSchema = z.object({
  id: z.string(),
  monsterId: z.string(),
  rank: MaterialRankSchema,
  name: z.string().min(1),
  targetReward: PercentValueSchema,
  captureReward: PercentValueSchema,
  brokenPartReward: PercentValueSchema,
  carveReward: PercentValueSchema,
  dropMaterialReward: PercentValueSchema,
  sortOrder: z.number().int(),
  bodyPartDrops: z.array(MaterialBodyPartDropSchema),
});
export type MonsterMaterial = z.infer<typeof MonsterMaterialSchema>;

export const MonsterHunterDetailSchema = z.object({
  bodyParts: z.array(MonsterBodyPartSchema),
  weaknesses: z.array(WeaknessEntrySchema),
  ailments: z.array(MonsterAilmentSchema),
  materials: z.array(MonsterMaterialSchema),
});
export type MonsterHunterDetail = z.infer<typeof MonsterHunterDetailSchema>;

export const PatchMonsterStatsSchema = z
  .object({
    numberOfHunts: z.number().int().nonnegative().optional(),
    hunts: z.number().int().nonnegative().optional(),
    wins: z.number().int().nonnegative().optional(),
    losses: z.number().int().nonnegative().optional(),
    captures: z.number().int().nonnegative().optional(),
    failedQuests: z.number().int().nonnegative().optional(),
    deltas: z
      .object({
        numberOfHunts: z.number().int().optional(),
        hunts: z.number().int().optional(),
        wins: z.number().int().optional(),
        losses: z.number().int().optional(),
        captures: z.number().int().optional(),
        failedQuests: z.number().int().optional(),
      })
      .optional(),
  })
  .refine((v) => Object.keys(v).length > 0, { message: "At least one stat field required" });

export const CreateBodyPartSchema = z.object({ name: z.string().min(1), sortOrder: z.number().int().optional() });
export const UpdateBodyPartSchema = z.object({ name: z.string().min(1).optional(), sortOrder: z.number().int().optional() });

export const PatchWeaknessSchema = z.object({
  bodyPartId: z.string(),
  slash: WeaknessValueSchema.optional(),
  blunt: WeaknessValueSchema.optional(),
  pierce: WeaknessValueSchema.optional(),
  fire: WeaknessValueSchema.optional(),
  water: WeaknessValueSchema.optional(),
  thunder: WeaknessValueSchema.optional(),
  ice: WeaknessValueSchema.optional(),
  dragon: WeaknessValueSchema.optional(),
});

export const CreateAilmentSchema = z.object({
  name: z.string().min(1),
  isCustom: z.boolean().optional(),
  initialResistance: z.number().int().min(0).max(100).optional(),
  nextResistanceThreshold: z.number().int().min(0).max(100).optional(),
  maximumResistance: z.number().int().min(0).max(100).optional(),
  naturalBuildUpDegradation: z.number().int().min(0).max(100).optional(),
  totalEffectiveness: z.number().int().min(0).max(100).optional(),
});

export const UpdateAilmentSchema = CreateAilmentSchema.partial().extend({ name: z.string().min(1).optional() });

export const CreateMaterialSchema = z.object({
  rank: MaterialRankSchema,
  name: z.string().min(1),
  targetReward: PercentValueSchema.optional(),
  captureReward: PercentValueSchema.optional(),
  brokenPartReward: PercentValueSchema.optional(),
  carveReward: PercentValueSchema.optional(),
  dropMaterialReward: PercentValueSchema.optional(),
});

export const UpdateMaterialSchema = CreateMaterialSchema.partial();

export const InitializeRankSchema = z.object({
  from: MaterialRankSchema,
  to: MaterialRankSchema,
});

export const AddMaterialBodyPartDropSchema = z.object({
  bodyPartId: z.string(),
  chance: PercentValueSchema,
});

export const DEFAULT_MH_AILMENTS = [
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
] as const;

export const DEFAULT_MH_BODY_PARTS = ["Head", "Neck", "Body", "Wing", "Foreleg", "Hind Leg", "Tail"] as const;

export type PatchMonsterStats = z.infer<typeof PatchMonsterStatsSchema>;
export type PatchWeakness = z.infer<typeof PatchWeaknessSchema>;
