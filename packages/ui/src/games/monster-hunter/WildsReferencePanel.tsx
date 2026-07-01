import type { MonsterWildsData } from "@game-tracker/shared";

function starsLabel(stars: number): string {
  return "★".repeat(stars) + "☆".repeat(Math.max(0, 3 - stars));
}

export function WildsReferencePanel({ data }: { data: MonsterWildsData }) {
  return (
    <div className="space-y-6">
      <section>
        <h3 className="mb-2 font-hand text-xl text-ink">Elemental Weaknesses</h3>
        <div className="overflow-x-auto">
          <table className="notebook-table" aria-label="Elemental weakness table">
            <thead>
              <tr>
                <th>Fire</th>
                <th>Water</th>
                <th>Thunder</th>
                <th>Ice</th>
                <th>Dragon</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                {(["fire", "water", "thunder", "ice", "dragon"] as const).map((el) => {
                  const w = data.elementalWeaknesses.find((x) => x.element === el);
                  return (
                    <td key={el} className="text-rust">
                      {w ? starsLabel(w.stars) : "—"}
                    </td>
                  );
                })}
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h3 className="mb-2 font-hand text-xl text-ink">Body Part Weaknesses</h3>
        <div className="overflow-x-auto">
          <table className="notebook-table text-xs" aria-label="Body part weakness table">
            <thead>
              <tr>
                <th>Part</th>
                <th>Slash</th>
                <th>Blunt</th>
                <th>Ammo</th>
                <th>Element</th>
              </tr>
            </thead>
            <tbody>
              {data.bodyPartWeaknesses.map((p) => (
                <tr key={p.part}>
                  <td className="font-medium">{p.part}</td>
                  <td>{p.slash}</td>
                  <td>{p.blunt}</td>
                  <td>{p.ammo}</td>
                  <td>{p.element}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {data.breakableParts && data.breakableParts.length > 0 && (
        <section>
          <h3 className="mb-2 font-hand text-xl text-ink">Breakable Parts</h3>
          <ul className="flex flex-wrap gap-2">
            {data.breakableParts.map((part) => (
              <li key={part} className="notebook-stat-panel rounded-md px-3 py-1 text-sm">
                {part}
              </li>
            ))}
          </ul>
        </section>
      )}

      {data.woundData && data.woundData.length > 0 && (
        <section>
          <h3 className="mb-2 font-hand text-xl text-ink">Wound Information</h3>
          <ul className="space-y-2">
            {data.woundData.map((w) => (
              <li key={w.part} className="notebook-stat-panel text-sm">
                <span className="notebook-stat-value font-medium">{w.part}</span>
                <span className="notebook-stat-label"> — {w.description}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {data.huntRewards && data.huntRewards.length > 0 && (
        <section>
          <h3 className="mb-2 font-hand text-xl text-ink">Hunt Rewards</h3>
          <ul className="list-inside list-disc text-sm text-ink-muted">
            {data.huntRewards.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
