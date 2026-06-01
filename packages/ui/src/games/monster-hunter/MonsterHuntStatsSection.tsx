import type { Monster } from "@game-tracker/shared";
import { CounterControl } from "./CounterControl";

type StatKey = "numberOfHunts" | "wins" | "losses" | "captures" | "failedQuests";

const STAT_LABELS: Record<StatKey, string> = {
  numberOfHunts: "Hunts",
  wins: "Wins",
  losses: "Losses",
  captures: "Captures",
  failedQuests: "Failed Quests",
};

export function MonsterHuntStatsSection({
  monster,
  onPatchStats,
  onHunted,
  onCaptured,
}: {
  monster: Monster;
  onPatchStats: (patch: { deltas?: Partial<Record<StatKey, number>> } | Partial<Record<StatKey, number>>) => void;
  onHunted: () => void;
  onCaptured: () => void;
}) {
  const keys: StatKey[] = monster.canBeCaptured
    ? ["numberOfHunts", "wins", "losses", "captures", "failedQuests"]
    : ["numberOfHunts", "wins", "losses", "failedQuests"];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={onHunted}
          className="rounded-md bg-amber-700 px-4 py-2 text-sm font-medium hover:bg-amber-600"
        >
          Hunted
        </button>
        {monster.canBeCaptured && (
          <button
            type="button"
            onClick={onCaptured}
            className="rounded-md bg-sky-700 px-4 py-2 text-sm font-medium hover:bg-sky-600"
          >
            Captured
          </button>
        )}
      </div>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
        {keys.map((key) => (
          <CounterControl
            key={key}
            label={STAT_LABELS[key]}
            value={monster[key]}
            onIncrement={() => onPatchStats({ deltas: { [key]: 1 } })}
            onDecrement={() => onPatchStats({ deltas: { [key]: -1 } })}
            onSetValue={(v) => onPatchStats({ [key]: v })}
          />
        ))}
      </div>
    </div>
  );
}
