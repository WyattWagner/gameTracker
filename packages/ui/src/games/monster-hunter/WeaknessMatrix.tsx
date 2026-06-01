import type { MonsterBodyPart, WeaknessEntry } from "@game-tracker/shared";

const COLUMNS = [
  { key: "slash", label: "Slash" },
  { key: "blunt", label: "Blunt" },
  { key: "pierce", label: "Pierce" },
  { key: "fire", label: "Fire" },
  { key: "water", label: "Water" },
  { key: "thunder", label: "Thunder" },
  { key: "ice", label: "Ice" },
  { key: "dragon", label: "Dragon" },
] as const;

type WeaknessKey = (typeof COLUMNS)[number]["key"];

export function WeaknessMatrix({
  bodyParts,
  weaknesses,
  onUpdateCell,
}: {
  bodyParts: MonsterBodyPart[];
  weaknesses: WeaknessEntry[];
  onUpdateCell: (bodyPartId: string, field: WeaknessKey, value: number) => void;
}) {
  const byPart = new Map(weaknesses.map((w) => [w.bodyPartId, w]));

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border-collapse text-sm">
        <thead>
          <tr className="border-b border-slate-700">
            <th className="sticky left-0 bg-slate-900 px-2 py-2 text-left">Part</th>
            {COLUMNS.map((c) => (
              <th key={c.key} className="px-2 py-2 text-center text-slate-400">
                {c.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {bodyParts.map((part) => {
            const row = byPart.get(part.id);
            if (!row) return null;
            return (
              <tr key={part.id} className="border-b border-slate-800">
                <td className="sticky left-0 bg-slate-900 px-2 py-1 font-medium">{part.name}</td>
                {COLUMNS.map((c) => (
                  <td key={c.key} className="px-1 py-1 text-center">
                    <input
                      type="number"
                      min={0}
                      max={99}
                      value={String(row[c.key]).padStart(2, "0")}
                      onChange={(e) => {
                        const v = Math.min(99, Math.max(0, Number(e.target.value) || 0));
                        onUpdateCell(part.id, c.key, v);
                      }}
                      className="w-12 rounded border border-slate-600 bg-slate-800 px-1 py-0.5 text-center"
                    />
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
