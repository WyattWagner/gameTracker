import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ErrorState, LoadingState, MonsterStatsPanel } from "@game-tracker/ui";
import type { Monster } from "@game-tracker/shared";
import { useAuth } from "../api/AuthContext";
import { useDrops } from "../hooks/useDrops";

export function MonsterDetailPage() {
  const { monsterId } = useParams();
  const { api } = useAuth();
  const [monster, setMonster] = useState<Monster | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { drops } = useDrops("monster-hunter", monsterId);

  useEffect(() => {
    if (!monsterId) return;
    setLoading(true);
    api
      .getMonster(monsterId)
      .then(setMonster)
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load monster"))
      .finally(() => setLoading(false));
  }, [api, monsterId]);

  if (loading) return <LoadingState message="Loading monster..." />;
  if (error) return <ErrorState message={error} />;
  if (!monster) return null;

  return (
    <div className="space-y-6">
      <header className="flex items-center gap-4">
        <img
          src={monster.imageUrl ?? "https://placehold.co/120x120/1e293b/94a3b8?text=Monster"}
          alt={monster.name}
          className="h-24 w-24 rounded-lg border border-slate-700 object-cover"
        />
        <div>
          <h2 className="text-2xl font-semibold">{monster.name}</h2>
          <p className="text-sm text-slate-400">Game: {monster.gameId}</p>
        </div>
      </header>

      <MonsterStatsPanel monster={monster} />

      <section>
        <h3 className="mb-2 text-lg font-medium">Notes</h3>
        <p className="rounded-md border border-slate-800 bg-slate-900/50 p-3 text-sm text-slate-300">
          {monster.notes ?? "No notes yet."}
        </p>
      </section>

      <section>
        <h3 className="mb-2 text-lg font-medium">Drop History</h3>
        <ul className="space-y-2">
          {drops.length === 0 && <li className="text-slate-400">No drops recorded.</li>}
          {drops.map((drop) => (
            <li key={drop.id} className="rounded-md border border-slate-800 bg-slate-900/50 px-3 py-2 text-sm">
              {drop.dropName} × {drop.quantity} ({drop.rarity})
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
