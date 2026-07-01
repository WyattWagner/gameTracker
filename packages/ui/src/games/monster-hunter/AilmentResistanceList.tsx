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
  onDeleteAilment,
}: {
  ailments: MonsterAilment[];
  onUpdate: (ailmentId: string, field: BarKey, value: number) => void;
  onDeleteAilment?: (ailmentId: string) => void;
}) {
  return (
    <ul className="space-y-3">
      {ailments.map((a) => (
        <li key={a.id}>
          <details className="group rounded-lg border border-rust/30 bg-paper-dark/80">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 [&::-webkit-details-marker]:hidden">
              <span className="font-medium text-ink">{a.name}</span>
              <span className="flex shrink-0 items-center gap-3">
                <span className="text-rust">{formatStarRating(a.starRating ?? 0)}</span>
                <span
                  className="text-slate-500 transition group-open:rotate-180"
                  aria-hidden
                >
                  ▼
                </span>
                {a.isCustom && onDeleteAilment && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      onDeleteAilment(a.id);
                    }}
                    className="text-xs text-red-400 hover:text-red-300"
                  >
                    Delete
                  </button>
                )}
              </span>
            </summary>
            <div className="space-y-3 border-t border-slate-800 px-4 pb-4 pt-3">
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
          </details>
        </li>
      ))}
    </ul>
  );
}
