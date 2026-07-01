import type { MonsterDbMaterial } from "@game-tracker/shared";

const RANK_LABELS: Record<string, string> = {
  LOW: "Low Rank",
  HIGH: "High Rank",
  MASTER: "Master Rank",
};

export function CatalogMaterialsList({ materials }: { materials: MonsterDbMaterial[] }) {
  const byRank = ["LOW", "HIGH", "MASTER"] as const;

  if (materials.length === 0) {
    return <p className="text-slate-400">No materials in database for this monster.</p>;
  }

  return (
    <div className="space-y-6">
      {byRank.map((rank) => {
        const items = materials.filter((m) => m.rank === rank);
        if (items.length === 0) return null;
        return (
          <section key={rank}>
            <h3 className="mb-2 text-lg font-medium">{RANK_LABELS[rank]}</h3>
            <ul className="space-y-2">
              {items.map((m) => (
                <li
                  key={m.id}
                  className="flex items-center gap-3 rounded-md border border-slate-800 bg-slate-900/50 px-3 py-2 text-sm"
                >
                  {m.icon ? (
                    <img src={m.icon} alt="" className="h-10 w-10 rounded object-cover" loading="lazy" />
                  ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded bg-slate-800 text-xs text-slate-500">
                      ?
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-slate-200">{m.materialName}</p>
                    <p className="text-xs text-slate-400">
                      {m.rarity}
                      {m.dropSource ? ` · ${m.dropSource}` : ""}
                      {m.dropRate != null ? ` · ${m.dropRate}%` : ""}
                    </p>
                    {m.description && <p className="text-xs text-slate-500">{m.description}</p>}
                  </div>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
