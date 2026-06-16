import { FormEvent, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import type { MonsterCatalogEntry } from "@game-tracker/shared";
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

  const [catalog, setCatalog] = useState<MonsterCatalogEntry[]>([]);
  const [catalogMeta, setCatalogMeta] = useState<{ gameTitle: string; sourceUrl: string } | null>(null);
  const [catalogLoading, setCatalogLoading] = useState(true);
  const [catalogSearch, setCatalogSearch] = useState("");
  const [selectedCatalogId, setSelectedCatalogId] = useState("");

  useEffect(() => {
    let cancelled = false;
    async function loadCatalog() {
      setCatalogLoading(true);
      try {
        const data = await api.listCatalogMonsters("?gameId=monster-hunter&type=large");
        if (!cancelled) {
          setCatalog(data.monsters);
          setCatalogMeta({ gameTitle: data.gameTitle, sourceUrl: data.sourceUrl });
          if (data.monsters[0]) setSelectedCatalogId(data.monsters[0].id);
        }
      } catch {
        if (!cancelled) setCatalog([]);
      } finally {
        if (!cancelled) setCatalogLoading(false);
      }
    }
    void loadCatalog();
    return () => {
      cancelled = true;
    };
  }, [api]);

  const trackedNames = useMemo(() => new Set(monsters.map((m) => m.name.toLowerCase())), [monsters]);

  const filteredCatalog = useMemo(() => {
    const term = catalogSearch.trim().toLowerCase();
    if (!term) return catalog;
    return catalog.filter(
      (entry) =>
        entry.name.toLowerCase().includes(term) ||
        (entry.species?.toLowerCase().includes(term) ?? false),
    );
  }, [catalog, catalogSearch]);

  const selectedEntry = catalog.find((entry) => entry.id === selectedCatalogId);

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

  async function onAddFromCatalog(event: FormEvent) {
    event.preventDefault();
    if (!selectedCatalogId) return;
    setCreating(true);
    setCreateError(null);
    try {
      await api.createMonsterFromCatalog({ gameId: "monster-hunter", catalogId: selectedCatalogId });
      await refresh();
    } catch (err) {
      setCreateError(err instanceof Error ? err.message : "Failed to add monster from catalog");
    } finally {
      setCreating(false);
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Monsters</h2>
      <input
        className="w-full max-w-sm rounded-md border border-slate-700 bg-slate-950 px-3 py-2"
        placeholder="Search your monsters"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <section className="space-y-3 rounded-lg border border-slate-800 bg-slate-900/50 p-4">
        <h3 className="text-lg font-medium">Add from game database</h3>
        {catalogMeta && (
          <p className="text-sm text-slate-400">
            {catalogMeta.gameTitle} — {catalog.length} large monsters (
            <a className="text-emerald-400 hover:underline" href={catalogMeta.sourceUrl} rel="noreferrer" target="_blank">
              data source
            </a>
            )
          </p>
        )}
        {catalogLoading ? (
          <LoadingState message="Loading monster catalog..." />
        ) : (
          <form onSubmit={onAddFromCatalog} className="space-y-3">
            <input
              className="w-full max-w-md rounded-md border border-slate-700 bg-slate-950 px-3 py-2"
              placeholder="Filter catalog (e.g. Rathalos)"
              value={catalogSearch}
              onChange={(e) => setCatalogSearch(e.target.value)}
            />
            <div className="flex flex-wrap gap-2">
              <select
                className="min-w-[16rem] flex-1 rounded-md border border-slate-700 bg-slate-950 px-3 py-2"
                value={selectedCatalogId}
                onChange={(e) => setSelectedCatalogId(e.target.value)}
              >
                {filteredCatalog.map((entry) => (
                  <option key={entry.id} value={entry.id} disabled={trackedNames.has(entry.name.toLowerCase())}>
                    {entry.name}
                    {trackedNames.has(entry.name.toLowerCase()) ? " (already added)" : ""}
                    {entry.species ? ` — ${entry.species}` : ""}
                  </option>
                ))}
              </select>
              <button
                className="rounded-md bg-emerald-600 px-3 py-2 hover:bg-emerald-500 disabled:opacity-50"
                type="submit"
                disabled={
                  creating ||
                  !selectedCatalogId ||
                  (selectedEntry ? trackedNames.has(selectedEntry.name.toLowerCase()) : true)
                }
              >
                {creating ? "Adding…" : "Add from catalog"}
              </button>
            </div>
            {selectedEntry?.description && (
              <p className="max-w-2xl text-sm text-slate-400">{selectedEntry.description}</p>
            )}
          </form>
        )}
      </section>

      <form onSubmit={onCreate} className="flex gap-2">
        <input
          className="rounded-md border border-slate-700 bg-slate-950 px-3 py-2"
          placeholder="Custom monster name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button
          className="rounded-md border border-slate-600 px-3 py-2 hover:border-emerald-600 disabled:opacity-50"
          type="submit"
          disabled={creating || !name.trim()}
        >
          {creating ? "Adding…" : "Add custom"}
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
