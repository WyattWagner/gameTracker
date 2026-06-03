import { FormEvent, useState } from "react";
import { Link } from "react-router-dom";
import { ErrorState, LoadingState } from "@game-tracker/ui";
import { useAuth } from "../api/AuthContext";
import { useMonsters } from "../hooks/useMonsters";

export function MonstersPage() {
  const { api } = useAuth();
  const [search, setSearch] = useState("");
  const { monsters, loading, error, refresh } = useMonsters("monster-hunter", search);
  const [name, setName] = useState("");
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  async function onCreate(event: FormEvent) {
    event.preventDefault();
    if (!name.trim()) return;
    setCreating(true);
    setCreateError(null);
    try {
      await api.createMonster({ gameId: "monster-hunter", name: name.trim() });
      setName("");
      await refresh();
    } catch (err) {
      setCreateError(err instanceof Error ? err.message : "Failed to add monster");
    } finally {
      setCreating(false);
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Monsters</h2>
      <input
        className="w-full max-w-sm rounded-md border border-slate-700 bg-slate-950 px-3 py-2"
        placeholder="Search monsters"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <form onSubmit={onCreate} className="flex gap-2">
        <input
          className="rounded-md border border-slate-700 bg-slate-950 px-3 py-2"
          placeholder="New monster name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button
          className="rounded-md bg-emerald-600 px-3 py-2 hover:bg-emerald-500 disabled:opacity-50"
          type="submit"
          disabled={creating || !name.trim()}
        >
          {creating ? "Adding…" : "Add Monster"}
        </button>
      </form>

      {createError && <ErrorState message={createError} />}
      {loading && <LoadingState />}
      {error && <ErrorState message={error} />}

      <div className="grid gap-3 md:grid-cols-2">
        {monsters.map((monster) => (
          <Link
            key={monster.id}
            to={`/monsters/${monster.id}`}
            className="rounded-lg border border-slate-800 bg-slate-900/60 p-4 hover:border-emerald-700"
          >
            <h3 className="font-medium">{monster.name}</h3>
            <p className="text-sm text-slate-400">{monster.hunts} hunts</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
