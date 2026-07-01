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

function CellInput({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <input
      type="number"
      min={0}
      max={99}
      value={String(value).padStart(2, "0")}
      onChange={(e) => {
        const v = Math.min(99, Math.max(0, Number(e.target.value) || 0));
        onChange(v);
      }}
      className="w-12 rounded border border-rust/40 bg-paper px-1 py-0.5 text-center text-ink"
    />
  );
}

export function WeaknessMatrix({
  bodyParts,
  weaknesses,
  onUpdateCell,
  onDeleteBodyPart,
}: {
  bodyParts: MonsterBodyPart[];
  weaknesses: WeaknessEntry[];
  onUpdateCell: (bodyPartId: string, field: WeaknessKey, value: number) => void;
  onDeleteBodyPart?: (bodyPartId: string) => void;
}) {
  const byPart = new Map(weaknesses.map((w) => [w.bodyPartId, w]));

  return (
    <>
      <div className="space-y-3 md:hidden">
        {bodyParts.map((part) => {
          const row = byPart.get(part.id);
          if (!row) return null;
          return (
            <div key={part.id} className="rounded-lg border border-rust/30 bg-paper-dark/60 p-3">
              <div className="mb-2 flex items-center justify-between">
                <span className="font-medium text-ink">{part.name}</span>
                {onDeleteBodyPart && (
                  <button type="button" onClick={() => onDeleteBodyPart(part.id)} className="text-xs text-wax">
                    Delete
                  </button>
                )}
              </div>
              <div className="grid grid-cols-2 gap-2">
                {COLUMNS.map((c) => (
                  <label key={c.key} className="flex items-center justify-between gap-2 text-xs text-ink-muted">
                    {c.label}
                    <CellInput value={row[c.key]} onChange={(v) => onUpdateCell(part.id, c.key, v)} />
                  </label>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div className="hidden overflow-x-auto md:block">
        <table className="min-w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-rule">
              <th className="sticky left-0 bg-paper px-2 py-2 text-left text-ink">Part</th>
              {COLUMNS.map((c) => (
                <th key={c.key} className="px-2 py-2 text-center text-ink-muted">
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
                <tr key={part.id} className="border-b border-rule/60">
                  <td className="sticky left-0 bg-paper px-2 py-1 font-medium text-ink">
                    <span className="inline-flex items-center gap-2">
                      {part.name}
                      {onDeleteBodyPart && (
                        <button
                          type="button"
                          onClick={() => onDeleteBodyPart(part.id)}
                          className="text-xs text-wax hover:underline"
                          aria-label={`Delete ${part.name}`}
                        >
                          Delete
                        </button>
                      )}
                    </span>
                  </td>
                  {COLUMNS.map((c) => (
                    <td key={c.key} className="px-1 py-1 text-center">
                      <CellInput value={row[c.key]} onChange={(v) => onUpdateCell(part.id, c.key, v)} />
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}
