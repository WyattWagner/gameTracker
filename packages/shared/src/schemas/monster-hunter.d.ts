import { z } from "zod";
export declare const MaterialRankSchema: z.ZodEnum<{
    LOW: "LOW";
    HIGH: "HIGH";
    MASTER: "MASTER";
}>;
export type MaterialRank = z.infer<typeof MaterialRankSchema>;
export declare const ResistanceValueSchema: z.ZodUnion<readonly [z.ZodLiteral<0>, z.ZodLiteral<25>, z.ZodLiteral<50>, z.ZodLiteral<75>, z.ZodLiteral<100>]>;
export declare const WeaknessValueSchema: z.ZodNumber;
export declare const PercentValueSchema: z.ZodNumber;
export declare const MonsterBodyPartSchema: z.ZodObject<{
    id: z.ZodString;
    monsterId: z.ZodString;
    name: z.ZodString;
    sortOrder: z.ZodNumber;
}, z.core.$strip>;
export type MonsterBodyPart = z.infer<typeof MonsterBodyPartSchema>;
export declare const WeaknessEntrySchema: z.ZodObject<{
    id: z.ZodString;
    monsterId: z.ZodString;
    bodyPartId: z.ZodString;
    slash: z.ZodNumber;
    blunt: z.ZodNumber;
    pierce: z.ZodNumber;
    fire: z.ZodNumber;
    water: z.ZodNumber;
    thunder: z.ZodNumber;
    ice: z.ZodNumber;
    dragon: z.ZodNumber;
}, z.core.$strip>;
export type WeaknessEntry = z.infer<typeof WeaknessEntrySchema>;
export declare const MonsterAilmentSchema: z.ZodObject<{
    id: z.ZodString;
    monsterId: z.ZodString;
    name: z.ZodString;
    isCustom: z.ZodBoolean;
    initialResistance: z.ZodNumber;
    nextResistanceThreshold: z.ZodNumber;
    maximumResistance: z.ZodNumber;
    naturalBuildUpDegradation: z.ZodNumber;
    totalEffectiveness: z.ZodNumber;
    sortOrder: z.ZodNumber;
    starRating: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<0>, z.ZodLiteral<1>, z.ZodLiteral<2>, z.ZodLiteral<3>]>>;
}, z.core.$strip>;
export type MonsterAilment = z.infer<typeof MonsterAilmentSchema>;
export declare const MaterialBodyPartDropSchema: z.ZodObject<{
    id: z.ZodString;
    materialId: z.ZodString;
    bodyPartId: z.ZodString;
    chance: z.ZodNumber;
}, z.core.$strip>;
export type MaterialBodyPartDrop = z.infer<typeof MaterialBodyPartDropSchema>;
export declare const MonsterMaterialSchema: z.ZodObject<{
    id: z.ZodString;
    monsterId: z.ZodString;
    rank: z.ZodEnum<{
        LOW: "LOW";
        HIGH: "HIGH";
        MASTER: "MASTER";
    }>;
    name: z.ZodString;
    targetReward: z.ZodNumber;
    captureReward: z.ZodNumber;
    brokenPartReward: z.ZodNumber;
    carveReward: z.ZodNumber;
    dropMaterialReward: z.ZodNumber;
    sortOrder: z.ZodNumber;
    bodyPartDrops: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        materialId: z.ZodString;
        bodyPartId: z.ZodString;
        chance: z.ZodNumber;
    }, z.core.$strip>>;
}, z.core.$strip>;
export type MonsterMaterial = z.infer<typeof MonsterMaterialSchema>;
export declare const MonsterHunterDetailSchema: z.ZodObject<{
    bodyParts: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        monsterId: z.ZodString;
        name: z.ZodString;
        sortOrder: z.ZodNumber;
    }, z.core.$strip>>;
    weaknesses: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        monsterId: z.ZodString;
        bodyPartId: z.ZodString;
        slash: z.ZodNumber;
        blunt: z.ZodNumber;
        pierce: z.ZodNumber;
        fire: z.ZodNumber;
        water: z.ZodNumber;
        thunder: z.ZodNumber;
        ice: z.ZodNumber;
        dragon: z.ZodNumber;
    }, z.core.$strip>>;
    ailments: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        monsterId: z.ZodString;
        name: z.ZodString;
        isCustom: z.ZodBoolean;
        initialResistance: z.ZodNumber;
        nextResistanceThreshold: z.ZodNumber;
        maximumResistance: z.ZodNumber;
        naturalBuildUpDegradation: z.ZodNumber;
        totalEffectiveness: z.ZodNumber;
        sortOrder: z.ZodNumber;
        starRating: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<0>, z.ZodLiteral<1>, z.ZodLiteral<2>, z.ZodLiteral<3>]>>;
    }, z.core.$strip>>;
    materials: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        monsterId: z.ZodString;
        rank: z.ZodEnum<{
            LOW: "LOW";
            HIGH: "HIGH";
            MASTER: "MASTER";
        }>;
        name: z.ZodString;
        targetReward: z.ZodNumber;
        captureReward: z.ZodNumber;
        brokenPartReward: z.ZodNumber;
        carveReward: z.ZodNumber;
        dropMaterialReward: z.ZodNumber;
        sortOrder: z.ZodNumber;
        bodyPartDrops: z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            materialId: z.ZodString;
            bodyPartId: z.ZodString;
            chance: z.ZodNumber;
        }, z.core.$strip>>;
    }, z.core.$strip>>;
}, z.core.$strip>;
export type MonsterHunterDetail = z.infer<typeof MonsterHunterDetailSchema>;
export declare const PatchMonsterStatsSchema: z.ZodObject<{
    numberOfHunts: z.ZodOptional<z.ZodNumber>;
    hunts: z.ZodOptional<z.ZodNumber>;
    wins: z.ZodOptional<z.ZodNumber>;
    losses: z.ZodOptional<z.ZodNumber>;
    captures: z.ZodOptional<z.ZodNumber>;
    failedQuests: z.ZodOptional<z.ZodNumber>;
    deltas: z.ZodOptional<z.ZodObject<{
        numberOfHunts: z.ZodOptional<z.ZodNumber>;
        hunts: z.ZodOptional<z.ZodNumber>;
        wins: z.ZodOptional<z.ZodNumber>;
        losses: z.ZodOptional<z.ZodNumber>;
        captures: z.ZodOptional<z.ZodNumber>;
        failedQuests: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strip>>;
}, z.core.$strip>;
export declare const CreateBodyPartSchema: z.ZodObject<{
    name: z.ZodString;
    sortOrder: z.ZodOptional<z.ZodNumber>;
}, z.core.$strip>;
export declare const UpdateBodyPartSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    sortOrder: z.ZodOptional<z.ZodNumber>;
}, z.core.$strip>;
export declare const PatchWeaknessSchema: z.ZodObject<{
    bodyPartId: z.ZodString;
    slash: z.ZodOptional<z.ZodNumber>;
    blunt: z.ZodOptional<z.ZodNumber>;
    pierce: z.ZodOptional<z.ZodNumber>;
    fire: z.ZodOptional<z.ZodNumber>;
    water: z.ZodOptional<z.ZodNumber>;
    thunder: z.ZodOptional<z.ZodNumber>;
    ice: z.ZodOptional<z.ZodNumber>;
    dragon: z.ZodOptional<z.ZodNumber>;
}, z.core.$strip>;
export declare const CreateAilmentSchema: z.ZodObject<{
    name: z.ZodString;
    isCustom: z.ZodOptional<z.ZodBoolean>;
    initialResistance: z.ZodOptional<z.ZodNumber>;
    nextResistanceThreshold: z.ZodOptional<z.ZodNumber>;
    maximumResistance: z.ZodOptional<z.ZodNumber>;
    naturalBuildUpDegradation: z.ZodOptional<z.ZodNumber>;
    totalEffectiveness: z.ZodOptional<z.ZodNumber>;
}, z.core.$strip>;
export declare const UpdateAilmentSchema: z.ZodObject<{
    isCustom: z.ZodOptional<z.ZodOptional<z.ZodBoolean>>;
    initialResistance: z.ZodOptional<z.ZodOptional<z.ZodNumber>>;
    nextResistanceThreshold: z.ZodOptional<z.ZodOptional<z.ZodNumber>>;
    maximumResistance: z.ZodOptional<z.ZodOptional<z.ZodNumber>>;
    naturalBuildUpDegradation: z.ZodOptional<z.ZodOptional<z.ZodNumber>>;
    totalEffectiveness: z.ZodOptional<z.ZodOptional<z.ZodNumber>>;
    name: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const CreateMaterialSchema: z.ZodObject<{
    rank: z.ZodEnum<{
        LOW: "LOW";
        HIGH: "HIGH";
        MASTER: "MASTER";
    }>;
    name: z.ZodString;
    targetReward: z.ZodOptional<z.ZodNumber>;
    captureReward: z.ZodOptional<z.ZodNumber>;
    brokenPartReward: z.ZodOptional<z.ZodNumber>;
    carveReward: z.ZodOptional<z.ZodNumber>;
    dropMaterialReward: z.ZodOptional<z.ZodNumber>;
}, z.core.$strip>;
export declare const UpdateMaterialSchema: z.ZodObject<{
    rank: z.ZodOptional<z.ZodEnum<{
        LOW: "LOW";
        HIGH: "HIGH";
        MASTER: "MASTER";
    }>>;
    name: z.ZodOptional<z.ZodString>;
    targetReward: z.ZodOptional<z.ZodOptional<z.ZodNumber>>;
    captureReward: z.ZodOptional<z.ZodOptional<z.ZodNumber>>;
    brokenPartReward: z.ZodOptional<z.ZodOptional<z.ZodNumber>>;
    carveReward: z.ZodOptional<z.ZodOptional<z.ZodNumber>>;
    dropMaterialReward: z.ZodOptional<z.ZodOptional<z.ZodNumber>>;
}, z.core.$strip>;
export declare const InitializeRankSchema: z.ZodObject<{
    from: z.ZodEnum<{
        LOW: "LOW";
        HIGH: "HIGH";
        MASTER: "MASTER";
    }>;
    to: z.ZodEnum<{
        LOW: "LOW";
        HIGH: "HIGH";
        MASTER: "MASTER";
    }>;
}, z.core.$strip>;
export declare const AddMaterialBodyPartDropSchema: z.ZodObject<{
    bodyPartId: z.ZodString;
    chance: z.ZodNumber;
}, z.core.$strip>;
export declare const DEFAULT_MH_AILMENTS: readonly ["Poison", "Stun", "Paralysis", "Sleep", "Blast", "Exhaust", "Fireblight", "Waterblight", "Thunderblight", "Iceblight"];
export declare const DEFAULT_MH_BODY_PARTS: readonly ["Head", "Neck", "Body", "Wing", "Foreleg", "Hind Leg", "Tail"];
/** All resistance bars at 0% — used when catalog/game data has no entry for an ailment. */
export declare const ZERO_AILMENT_BARS: {
    readonly initialResistance: 0;
    readonly nextResistanceThreshold: 0;
    readonly maximumResistance: 0;
    readonly naturalBuildUpDegradation: 0;
    readonly totalEffectiveness: 0;
};
export type PatchMonsterStats = z.infer<typeof PatchMonsterStatsSchema>;
export type PatchWeakness = z.infer<typeof PatchWeaknessSchema>;
//# sourceMappingURL=monster-hunter.d.ts.map