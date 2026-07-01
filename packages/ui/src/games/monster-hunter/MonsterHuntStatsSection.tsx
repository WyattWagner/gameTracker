import type { Monster } from "@game-tracker/shared";
import { CounterControl } from "./CounterControl";

type StatKey = "numberOfHunts" | "hunts" | "wins" | "captures" | "failedQuests";

const STAT_LABELS: Record<StatKey, string> = {
  numberOfHunts: "Quests Accepted",
  hunts: "Hunts",
  wins: "Quests Completed",
  captures: "Captures",
  failedQuests: "Failed Quests",
};

export function MonsterHuntStatsSection({
  monster,
  onPatchStats,
  onHunt,
  onCaptured,
  onQuestFailed,
}: {
  monster: Monster;
  onPatchStats: (patch: { deltas?: Partial<Record<StatKey, number>> } | Partial<Record<StatKey, number>>) => void;
  onHunt: () => void;
  onCaptured: () => void;
  onQuestFailed: () => void;
}) {
  const keys: StatKey[] = monster.canBeCaptured
    ? ["numberOfHunts", "hunts", "wins", "captures", "failedQuests"]
    : ["numberOfHunts", "hunts", "wins", "failedQuests"];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={onHunt}
          className="rounded-md bg-moss px-4 py-2 text-sm font-medium text-paper shadow-sm hover:bg-moss/90"
        >
          Hunt
        </button>
        {monster.canBeCaptured && (
          <button
            type="button"
            onClick={onCaptured}
            className="rounded-md bg-sky-700 px-4 py-2 text-sm font-medium text-paper hover:bg-sky-600"
          >
            Captured
          </button>
        )}
        <button
          type="button"
          onClick={onQuestFailed}
          className="rounded-md bg-wax px-4 py-2 text-sm font-medium text-paper hover:bg-wax/90"
        >
          Quest Failed
        </button>
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
