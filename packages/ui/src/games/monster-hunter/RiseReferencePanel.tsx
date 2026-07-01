import type { MonsterRiseData } from "@game-tracker/shared";

function starsLabel(stars: number): string {
  return "★".repeat(stars) + "☆".repeat(Math.max(0, 3 - stars));
}

export function RiseReferencePanel({ data }: { data: MonsterRiseData }) {
  return (
    <div className="space-y-6">
      <section>
        <h3 className="mb-2 font-hand text-xl text-ink">Elemental Weaknesses</h3>
        <div className="overflow-x-auto">
          <table className="notebook-table">
            <thead>
              <tr>
                <th>Element</th>
                <th>Rating</th>
              </tr>
            </thead>
            <tbody>
              {data.elementalWeaknesses.map((w) => (
                <tr key={w.element}>
                  <td className="capitalize">{w.element}</td>
                  <td className="text-rust" aria-label={`${w.stars} stars`}>
                    {starsLabel(w.stars)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {data.ailmentWeaknesses.length > 0 && (
        <section>
          <h3 className="mb-2 font-hand text-xl text-ink">Ailment Weaknesses</h3>
          <div className="overflow-x-auto">
            <table className="notebook-table">
              <thead>
                <tr>
                  <th>Ailment</th>
                  <th>Stars</th>
                  <th>Resistance</th>
                </tr>
              </thead>
              <tbody>
                {data.ailmentWeaknesses.map((a) => (
                  <tr key={a.ailment}>
                    <td>{a.ailment}</td>
                    <td className="text-rust">{starsLabel(a.stars)}</td>
                    <td>{a.resistance}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {data.bodyPartWeaknesses && data.bodyPartWeaknesses.length > 0 && (
        <section>
          <h3 className="mb-2 font-hand text-xl text-ink">Body Part Weaknesses</h3>
          <div className="overflow-x-auto">
            <table className="notebook-table text-xs">
              <thead>
                <tr>
                  <th>Part</th>
                  <th>Slash</th>
                  <th>Blunt</th>
                  <th>Pierce</th>
                  <th>Fire</th>
                  <th>Water</th>
                  <th>Thunder</th>
                  <th>Ice</th>
                  <th>Dragon</th>
                </tr>
              </thead>
              <tbody>
                {data.bodyPartWeaknesses.map((p) => (
                  <tr key={p.part}>
                    <td className="font-medium">{p.part}</td>
                    <td>{p.slash ?? "—"}</td>
                    <td>{p.blunt ?? "—"}</td>
                    <td>{p.pierce ?? "—"}</td>
                    <td>{p.fire ?? "—"}</td>
                    <td>{p.water ?? "—"}</td>
                    <td>{p.thunder ?? "—"}</td>
                    <td>{p.ice ?? "—"}</td>
                    <td>{p.dragon ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {(data.huntRewards?.length || data.captureRewards?.length || data.breakRewards?.length) && (
        <section className="grid gap-4 md:grid-cols-3">
          {data.huntRewards && data.huntRewards.length > 0 && (
            <div className="notebook-stat-panel">
              <h4 className="notebook-stat-label mb-2 text-sm font-medium">Hunt Rewards</h4>
              <ul className="list-inside list-disc text-sm text-paper/90">
                {data.huntRewards.map((r) => (
                  <li key={r}>{r}</li>
                ))}
              </ul>
            </div>
          )}
          {data.captureRewards && data.captureRewards.length > 0 && (
            <div className="notebook-stat-panel">
              <h4 className="notebook-stat-label mb-2 text-sm font-medium">Capture Rewards</h4>
              <ul className="list-inside list-disc text-sm text-paper/90">
                {data.captureRewards.map((r) => (
                  <li key={r}>{r}</li>
                ))}
              </ul>
            </div>
          )}
          {data.breakRewards && data.breakRewards.length > 0 && (
            <div className="notebook-stat-panel">
              <h4 className="notebook-stat-label mb-2 text-sm font-medium">Break Rewards</h4>
              <ul className="list-inside list-disc text-sm text-paper/90">
                {data.breakRewards.map((r) => (
                  <li key={r}>{r}</li>
                ))}
              </ul>
            </div>
          )}
        </section>
      )}
    </div>
  );
}
