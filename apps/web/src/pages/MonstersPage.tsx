import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import type { CatalogGameId, GameMonster } from "@game-tracker/shared";
import {
  ErrorState,
  LoadingState,
  MonsterSelect,
  NotebookButton,
  NotebookInput,
  NotebookSection,
} from "@game-tracker/ui";
import { useAuth } from "../api/AuthContext";
import type { AppNavigation } from "../hooks/useAppNavigation";
import { useMonsters } from "../hooks/useMonsters";

const GAME_OPTIONS: { id: CatalogGameId; label: string }[] = [
  { id: "monster-hunter", label: "World" },
  { id: "monster-hunter-rise", label: "Rise" },
  { id: "monster-hunter-wilds", label: "Wilds" },
];

const GAME_TAB_ACCENT: Record<CatalogGameId, string> = {
  "monster-hunter": "ring-moss border-moss",
  "monster-hunter-rise": "ring-rust border-rust",
  "monster-hunter-wilds": "ring-wilds-accent border-wilds-accent",
};

const WEAKNESS_OPTIONS = ["fire", "water", "thunder", "ice", "dragon"] as const;

export function MonstersPage({
  nav,
  onOpenMonster,
}: {
  nav: AppNavigation;
  onOpenMonster: (id: string) => void;
}) {
  const { api } = useAuth();
  const { prefs, updatePrefs } = nav;
  const activeGame = prefs.catalogGame;
  const { monsters, loading, error, refresh } = useMonsters(activeGame, prefs.monsterSearch);
  const [name, setName] = useState("");
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  const [catalog, setCatalog] = useState<GameMonster[]>([]);
  const [catalogTotal, setCatalogTotal] = useState(0);
  const [catalogMeta, setCatalogMeta] = useState<{ gameTitle: string; sourceUrl: string } | null>(null);
  const [catalogLoading, setCatalogLoading] = useState(true);
  const [selectedCatalogId, setSelectedCatalogId] = useState("");
  const [selectedTrackedId, setSelectedTrackedId] = useState("");

  const loadCatalog = useCallback(async () => {
    setCatalogLoading(true);
    try {
      const params = new URLSearchParams({
        gameId: activeGame,
        type: "large",
        page: String(prefs.catalogPage),
        pageSize: "50",
      });
      if (prefs.catalogSearch.trim()) params.set("search", prefs.catalogSearch.trim());
      if (prefs.monsterTypeFilter) params.set("monsterType", prefs.monsterTypeFilter);
      if (prefs.weaknessFilter) params.set("weaknessElement", prefs.weaknessFilter);

      const data = await api.listCatalogMonsters(`?${params.toString()}`);
      setCatalog(data.monsters);
      setCatalogTotal(data.total);
      setCatalogMeta({ gameTitle: data.gameTitle, sourceUrl: data.sourceUrl });
      if (data.monsters[0] && !data.monsters.some((m) => m.id === selectedCatalogId)) {
        setSelectedCatalogId(data.monsters[0].id);
      }
    } catch {
      setCatalog([]);
      setCatalogTotal(0);
    } finally {
      setCatalogLoading(false);
    }
  }, [
    api,
    activeGame,
    prefs.catalogPage,
    prefs.catalogSearch,
    prefs.monsterTypeFilter,
    prefs.weaknessFilter,
    selectedCatalogId,
  ]);

  useEffect(() => {
    void loadCatalog();
  }, [loadCatalog]);

  useEffect(() => {
    if (monsters[0] && !monsters.some((m) => m.id === selectedTrackedId)) {
      setSelectedTrackedId(monsters[0].id);
    }
    if (monsters.length === 0) {
      setSelectedTrackedId("");
    }
  }, [monsters, selectedTrackedId]);

  const trackedNames = useMemo(() => new Set(monsters.map((m) => m.name.toLowerCase())), [monsters]);
  const selectedEntry = catalog.find((entry) => entry.id === selectedCatalogId);
  const totalPages = Math.max(1, Math.ceil(catalogTotal / 50));

  async function onCreate(event: FormEvent) {
    event.preventDefault();
    if (!name.trim()) return;
    setCreating(true);
    setCreateError(null);
    try {
      await api.createMonster({ gameId: activeGame, name: name.trim() });
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
      await api.createMonsterFromCatalog({ gameId: activeGame, catalogId: selectedCatalogId });
      await refresh();
    } catch (err) {
      setCreateError(err instanceof Error ? err.message : "Failed to add monster from catalog");
    } finally {
      setCreating(false);
    }
  }

  function onOpenTracked() {
    if (selectedTrackedId) onOpenMonster(selectedTrackedId);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {GAME_OPTIONS.map((g) => (
          <NotebookButton
            key={g.id}
            variant={activeGame === g.id ? "primary" : "secondary"}
            type="button"
            className={activeGame === g.id ? `ring-2 ${GAME_TAB_ACCENT[g.id]}` : ""}
            onClick={() => updatePrefs({ catalogGame: g.id, catalogPage: 1 })}
          >
            {g.label}
          </NotebookButton>
        ))}
      </div>

      <NotebookInput
        placeholder="Search your monsters"
        value={prefs.monsterSearch}
        onChange={(e) => updatePrefs({ monsterSearch: e.target.value })}
        aria-label="Search your monsters"
      />

      <NotebookSection title="Bestiary appendix">
        {catalogMeta && (
          <p className="text-sm text-ink-muted">
            {catalogMeta.gameTitle} — {catalogTotal} large monsters (
            <a className="text-moss underline" href={catalogMeta.sourceUrl} rel="noreferrer" target="_blank">
              source
            </a>
            )
          </p>
        )}

        <button
          type="button"
          className="text-sm text-moss underline"
          onClick={() => updatePrefs({ catalogFiltersOpen: !prefs.catalogFiltersOpen })}
        >
          {prefs.catalogFiltersOpen ? "Hide filters" : "Show filters"}
        </button>

        {prefs.catalogFiltersOpen && (
          <div className="flex flex-wrap gap-2">
            <NotebookInput
              placeholder="Filter catalog"
              value={prefs.catalogSearch}
              onChange={(e) => updatePrefs({ catalogSearch: e.target.value, catalogPage: 1 })}
              className="min-w-[12rem] flex-1"
            />
            <NotebookInput
              placeholder="Monster type"
              value={prefs.monsterTypeFilter}
              onChange={(e) => updatePrefs({ monsterTypeFilter: e.target.value, catalogPage: 1 })}
            />
            <select
              className="min-h-[44px] rounded-md border border-rust/40 bg-paper/70 px-3 text-ink"
              value={prefs.weaknessFilter}
              onChange={(e) => updatePrefs({ weaknessFilter: e.target.value, catalogPage: 1 })}
            >
              <option value="">Any weakness</option>
              {WEAKNESS_OPTIONS.map((w) => (
                <option key={w} value={w}>
                  {w}
                </option>
              ))}
            </select>
          </div>
        )}

        {catalogLoading ? (
          <LoadingState message="Loading bestiary…" />
        ) : (
          <form onSubmit={onAddFromCatalog} className="space-y-3">
            <MonsterSelect
              gameId={activeGame}
              label="Add from catalog"
              value={selectedCatalogId}
              onChange={(e) => setSelectedCatalogId(e.target.value)}
            >
              {catalog.map((entry) => (
                <option key={entry.id} value={entry.id} disabled={trackedNames.has(entry.name.toLowerCase())}>
                  {entry.name}
                  {trackedNames.has(entry.name.toLowerCase()) ? " (tracked)" : ""}
                </option>
              ))}
            </MonsterSelect>
            <NotebookButton
              type="submit"
              disabled={
                creating ||
                !selectedCatalogId ||
                (selectedEntry ? trackedNames.has(selectedEntry.name.toLowerCase()) : true)
              }
            >
              {creating ? "Adding…" : "Add from catalog"}
            </NotebookButton>
            {totalPages > 1 && (
              <div className="flex items-center gap-2 text-sm">
                <NotebookButton
                  type="button"
                  variant="secondary"
                  disabled={prefs.catalogPage <= 1}
                  onClick={() => updatePrefs({ catalogPage: prefs.catalogPage - 1 })}
                >
                  Previous
                </NotebookButton>
                <span className="text-ink-muted">
                  Page {prefs.catalogPage} of {totalPages}
                </span>
                <NotebookButton
                  type="button"
                  variant="secondary"
                  disabled={prefs.catalogPage >= totalPages}
                  onClick={() => updatePrefs({ catalogPage: prefs.catalogPage + 1 })}
                >
                  Next
                </NotebookButton>
              </div>
            )}
          </form>
        )}
      </NotebookSection>

      <NotebookSection title="Your monsters">
        {loading ? (
          <LoadingState />
        ) : monsters.length === 0 ? (
          <p className="text-sm text-ink-muted">No monsters tracked for this game yet.</p>
        ) : (
          <div className="space-y-3">
            <MonsterSelect
              gameId={activeGame}
              label="Open monster"
              value={selectedTrackedId}
              onChange={(e) => setSelectedTrackedId(e.target.value)}
            >
              {monsters.map((monster) => (
                <option key={monster.id} value={monster.id}>
                  {monster.name} — {monster.hunts} hunts
                </option>
              ))}
            </MonsterSelect>
            <NotebookButton type="button" disabled={!selectedTrackedId} onClick={onOpenTracked}>
              Open
            </NotebookButton>
          </div>
        )}
      </NotebookSection>

      <form onSubmit={onCreate} className="flex flex-wrap gap-2">
        <NotebookInput placeholder="Custom monster name" value={name} onChange={(e) => setName(e.target.value)} className="flex-1" />
        <NotebookButton type="submit" variant="secondary" disabled={creating || !name.trim()}>
          {creating ? "Adding…" : "Add custom"}
        </NotebookButton>
      </form>

      {createError && <ErrorState message={createError} />}
      {error && <ErrorState message={error} />}
    </div>
  );
}
