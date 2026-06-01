import { formatStarRating } from "@game-tracker/domain";
import type { MonsterAilment } from "@game-tracker/shared";

const BAR_FIELDS = [
  { key: "initialResistance", label: "Initial Resistance" },
  { key: "nextResistanceThreshold", label: "Next Threshold" },
  { key: "maximumResistance", label: "Maximum Resistance" },
  { key: "naturalBuildUpDegradation", label: "Build-Up Degradation" },
  { key: "totalEffectiveness", label: "Total Effectiveness" },
] as const;

type BarKey = (typeof BAR_FIELDS)[number]["key"];

const SNAP = [0, 25, 50, 75, 100];

function snapResistance(value: number): number {
  return SNAP.reduce((prev, curr) => (Math.abs(curr - value) < Math.abs(prev - value) ? curr : prev));
}

export function AilmentResistanceList({
  ailments,
  onUpdate,
}: {
  ailments: MonsterAilment[];
  onUpdate: (ailmentId: string, field: BarKey, value: number) => void;
}) {
  return (
    <ul className="space-y-6">
      {ailments.map((a) => (
        <li key={a.id} className="rounded-lg border border-slate-800 bg-slate-900/50 p-4">
          <div className="mb-3 flex items-center justify-between">
            <span className="font-medium">{a.name}</span>
            <span className="text-amber-400">{formatStarRating(a.starRating ?? 0)}</span>
          </div>
          <div className="space-y-3">
            {BAR_FIELDS.map((bar) => (
              <div key={bar.key}>
                <label className="mb-1 block text-xs text-slate-400">{bar.label}</label>
                <input
                  type="range"
                  min={0}
                  max={100}
                  step={25}
                  value={a[bar.key]}
                  onChange={(e) => onUpdate(a.id, bar.key, snapResistance(Number(e.target.value)))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-slate-500">
                  {SNAP.map((v) => (
                    <span key={v}>{v}%</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </li>
      ))}
    </ul>
  );
}
