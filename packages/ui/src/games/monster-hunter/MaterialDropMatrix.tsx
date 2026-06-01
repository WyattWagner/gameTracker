import type { MaterialRank, MonsterBodyPart, MonsterMaterial } from "@game-tracker/shared";

const REWARD_COLS = [
  { key: "targetReward", label: "Target" },
  { key: "captureReward", label: "Capture" },
  { key: "brokenPartReward", label: "Broken" },
  { key: "carveReward", label: "Carve" },
  { key: "dropMaterialReward", label: "Drop" },
] as const;

type RewardKey = (typeof REWARD_COLS)[number]["key"];

export function RankTabs({
  rank,
  onChange,
}: {
  rank: MaterialRank;
  onChange: (rank: MaterialRank) => void;
}) {
  const ranks: MaterialRank[] = ["LOW", "HIGH", "MASTER"];
  const labels = { LOW: "Low Rank", HIGH: "High Rank", MASTER: "Master Rank" };
  return (
    <div className="flex gap-2">
      {ranks.map((r) => (
        <button
          key={r}
          type="button"
          onClick={() => onChange(r)}
          className={`rounded-md px-3 py-1.5 text-sm ${
            rank === r ? "bg-emerald-700 text-white" : "bg-slate-800 text-slate-300 hover:bg-slate-700"
          }`}
        >
          {labels[r]}
        </button>
      ))}
    </div>
  );
}

export function MaterialDropMatrix({
  materials,
  bodyParts,
  onUpdateReward,
  onAddBodyPartDrop,
  onRemoveBodyPartDrop,
}: {
  materials: MonsterMaterial[];
  bodyParts: MonsterBodyPart[];
  onUpdateReward: (materialId: string, field: RewardKey, value: number) => void;
  onAddBodyPartDrop: (materialId: string, bodyPartId: string, chance: number) => void;
  onRemoveBodyPartDrop: (materialId: string, bodyPartId: string) => void;
}) {
  return (
    <div className="space-y-6">
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-slate-700">
              <th className="px-2 py-2 text-left">Material</th>
              {REWARD_COLS.map((c) => (
                <th key={c.key} className="px-2 py-2 text-center text-slate-400">
                  {c.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {materials.map((m) => (
              <tr key={m.id} className="border-b border-slate-800">
                <td className="px-2 py-1 font-medium">{m.name}</td>
                {REWARD_COLS.map((c) => (
                  <td key={c.key} className="px-1 py-1 text-center">
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={m[c.key]}
                      onChange={(e) =>
                        onUpdateReward(m.id, c.key, Math.min(100, Math.max(0, Number(e.target.value) || 0)))
                      }
                      className="w-14 rounded border border-slate-600 bg-slate-800 px-1 py-0.5 text-center"
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {materials.map((m) => (
        <div key={`bp-${m.id}`} className="rounded border border-slate-800 p-3">
          <p className="mb-2 text-sm font-medium">Part drops: {m.name}</p>
          <ul className="mb-2 space-y-1 text-sm">
            {m.bodyPartDrops.map((d) => {
              const part = bodyParts.find((p) => p.id === d.bodyPartId);
              return (
                <li key={d.id} className="flex items-center gap-2">
                  <span>
                    {part?.name ?? d.bodyPartId}: {d.chance}%
                  </span>
                  <button
                    type="button"
                    onClick={() => onRemoveBodyPartDrop(m.id, d.bodyPartId)}
                    className="text-red-400 hover:text-red-300"
                  >
                    Remove
                  </button>
                </li>
              );
            })}
          </ul>
          <div className="flex flex-wrap gap-2">
            <select id={`bp-select-${m.id}`} className="rounded border border-slate-600 bg-slate-800 px-2 py-1 text-sm">
              {bodyParts.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
            <input
              type="number"
              min={0}
              max={100}
              defaultValue={50}
              id={`bp-chance-${m.id}`}
              className="w-16 rounded border border-slate-600 bg-slate-800 px-2 py-1 text-sm"
            />
            <button
              type="button"
              onClick={() => {
                const select = document.getElementById(`bp-select-${m.id}`) as HTMLSelectElement;
                const chanceInput = document.getElementById(`bp-chance-${m.id}`) as HTMLInputElement;
                onAddBodyPartDrop(m.id, select.value, Number(chanceInput.value) || 0);
              }}
              className="rounded bg-slate-700 px-2 py-1 text-sm hover:bg-slate-600"
            >
              Add part drop
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
