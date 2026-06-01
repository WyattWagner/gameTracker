import type { PatchMonsterStats } from "@game-tracker/shared";

type PatchStats = PatchMonsterStats;

const STAT_KEYS = ["numberOfHunts", "wins", "losses", "captures", "failedQuests"] as const;

export function applyMonsterStatsPatch(
  current: Record<(typeof STAT_KEYS)[number], number>,
  patch: PatchStats,
): Record<(typeof STAT_KEYS)[number], number> {
  const next = { ...current };

  for (const key of STAT_KEYS) {
    if (patch[key] !== undefined) {
      next[key] = patch[key]!;
    }
  }

  if (patch.deltas) {
    for (const key of STAT_KEYS) {
      const delta = patch.deltas[key];
      if (delta !== undefined) {
        next[key] = Math.max(0, next[key] + delta);
      }
    }
  }

  for (const key of STAT_KEYS) {
    if (next[key] < 0) {
      throw new Error(`Stat ${key} cannot be negative`);
    }
  }

  return next;
}
