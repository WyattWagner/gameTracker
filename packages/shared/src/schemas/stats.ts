import { z } from "zod";
import { EncounterResultSchema, RaritySchema } from "./common";

export const DashboardQuerySchema = z.object({
  gameId: z.string().optional(),
  from: z.string().datetime().optional(),
  to: z.string().datetime().optional(),
});
export type DashboardQuery = z.infer<typeof DashboardQuerySchema>;

export const RecentActivitySchema = z.object({
  id: z.string(),
  type: z.enum(["ENCOUNTER", "DROP", "QUEST"]),
  summary: z.string(),
  occurredAt: z.string().datetime(),
});
export type RecentActivity = z.infer<typeof RecentActivitySchema>;

export const DashboardStatsSchema = z.object({
  totalQuestsCompleted: z.number().int().nonnegative(),
  totalQuestsAccepted: z.number().int().nonnegative(),
  totalHunts: z.number().int().nonnegative(),
  monstersDefeated: z.number().int().nonnegative(),
  monstersCaptured: z.number().int().nonnegative(),
  monstersFailedAgainst: z.number().int().nonnegative(),
  mostHuntedMonster: z
    .object({
      id: z.string(),
      name: z.string(),
      hunts: z.number().int().nonnegative(),
    })
    .nullable(),
  rarestDropObtained: z
    .object({
      id: z.string(),
      dropName: z.string(),
      rarity: RaritySchema,
    })
    .nullable(),
  recentActivity: z.array(RecentActivitySchema),
});
export type DashboardStats = z.infer<typeof DashboardStatsSchema>;

export const DropAggregationSchema = z.object({
  totalMaterialsCollected: z.number().int().nonnegative(),
  rarestMaterials: z.array(
    z.object({
      dropName: z.string(),
      rarity: RaritySchema,
      totalQuantity: z.number().int().nonnegative(),
    }),
  ),
  mostFrequentMaterials: z.array(
    z.object({
      dropName: z.string(),
      totalQuantity: z.number().int().nonnegative(),
    }),
  ),
});
export type DropAggregation = z.infer<typeof DropAggregationSchema>;

/** Used when recording encounters to keep monster counters in sync. */
export const ENCOUNTER_RESULT_TO_MONSTER_FIELD: Record<
  z.infer<typeof EncounterResultSchema>,
  "wins" | "captures" | "failedQuests"
> = {
  WIN: "wins",
  LOSS: "failedQuests",
  CAPTURE: "captures",
  FAILED: "failedQuests",
};
