import { useCallback, useEffect, useState } from "react";
import {
  AilmentResistanceList,
  ErrorState,
  LoadingState,
  MonsterHuntStatsSection,
  MonsterImageGallery,
  NotebookButton,
  NotebookCard,
  NotebookInput,
  NotebookSection,
  NotebookTab,
  RiseReferencePanel,
  WeaknessMatrix,
  WildsReferencePanel,
} from "@game-tracker/ui";
import type { Monster, MonsterHunterDetail } from "@game-tracker/shared";
import { useAuth } from "../api/AuthContext";
import { useCatalogFamily } from "../hooks/useCatalogFamily";
import { useDrops } from "../hooks/useDrops";
import type { DetailTabId } from "../lib/preferences";
import { resolveAssetUrl } from "../lib/apiOrigin";

export function MonsterDetailPage({
  monsterId,
  onBack,
  detailTab,
  onDetailTabChange,
  onInvalidMonster,
}: {
  monsterId: string;
  onBack: () => void;
  detailTab: DetailTabId;
  onDetailTabChange: (tab: DetailTabId) => void;
  onInvalidMonster: () => void;
}) {
  const { api } = useAuth();
  const [monster, setMonster] = useState<Monster | null>(null);
  const [mh, setMh] = useState<MonsterHunterDetail | null>(null);
  const [newBodyPartName, setNewBodyPartName] = useState("");
  const [newAilmentName, setNewAilmentName] = useState("");
  const [tabError, setTabError] = useState<string | null>(null);
  const [tabBusy, setTabBusy] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { drops } = useDrops("monster-hunter", monsterId);
  const metadataFamilySlug =
    monster && typeof monster.metadata === "object" && monster.metadata !== null
      ? (monster.metadata as { familySlug?: string; catalogId?: string }).familySlug
      : undefined;
  const catalogId =
    monster && typeof monster.metadata === "object" && monster.metadata !== null
      ? (monster.metadata as { catalogId?: string }).catalogId
      : undefined;
  const { family, details: catalogDetails, loading: catalogLoading } = useCatalogFamily(
    monster?.name ?? "",
    metadataFamilySlug,
  );

  const reload = useCallback(async () => {
    const [m, detail] = await Promise.all([api.getMonster(monsterId), api.getMhDetail(monsterId)]);
    setMonster(m);
    setMh(detail);
  }, [api, monsterId]);

  useEffect(() => {
    setLoading(true);
    reload()
      .catch((err) => {
        const msg = err instanceof Error ? err.message : "Failed to load monster";
        setError(msg);
        if (msg.toLowerCase().includes("not found")) onInvalidMonster();
      })
      .finally(() => setLoading(false));
  }, [monsterId, reload, onInvalidMonster]);

  async function runTabAction(action: () => Promise<void>) {
    setTabError(null);
    setTabBusy(true);
    try {
      await action();
    } catch (err) {
      setTabError(err instanceof Error ? err.message : "Action failed");
    } finally {
      setTabBusy(false);
    }
  }

  if (loading) return <LoadingState message="Flipping to this page…" />;
  if (error) return <ErrorState message={error} />;
  if (!monster || !mh) return null;

  const hasRise = Boolean(catalogDetails["monster-hunter-rise"]?.riseData);
  const hasWilds = Boolean(catalogDetails["monster-hunter-wilds"]?.wildsData);
  const hasWorld = Boolean(catalogDetails["monster-hunter"]?.riseData);

  const tabs: { id: DetailTabId; label: string }[] = [
    { id: "overview", label: "Overview" },
    ...(hasWorld ? [{ id: "world" as const, label: "World" }] : []),
    ...(hasRise ? [{ id: "rise" as const, label: "Rise" }] : []),
    ...(hasWilds ? [{ id: "wilds" as const, label: "Wilds" }] : []),
    { id: "tracker", label: "Weaknesses & Ailments" },
    { id: "settings", label: "Settings" },
    { id: "log", label: "Hunt log" },
  ];

  const tab = tabs.some((t) => t.id === detailTab) ? detailTab : "overview";

  const heroCatalog =
    catalogDetails["monster-hunter-wilds"] ??
    catalogDetails["monster-hunter-rise"] ??
    catalogDetails["monster-hunter"];

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-start gap-4">
        <div className="relative">
          <img
            src={resolveAssetUrl(monster.imageUrl)}
            alt={monster.name}
            className="h-24 w-24 rounded-lg border-2 border-rust/50 object-cover shadow-sm"
          />
          <label className="mt-2 block cursor-pointer text-xs text-moss hover:underline">
            Sketch photo
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                const updated = await api.uploadMonsterImage(monsterId, file);
                setMonster(updated);
              }}
            />
          </label>
        </div>
        <div>
          <h2 className="font-serif text-2xl font-bold text-ink">{monster.name}</h2>
          <p className="text-sm text-ink-muted">{monster.gameId.replace("monster-hunter", "MH")}</p>
        </div>
      </header>

      <nav className="notebook-scroll-tabs -mx-1 flex gap-2 overflow-x-auto border-b border-rule pb-2">
        {tabs.map((t) => (
          <NotebookTab
            key={t.id}
            active={tab === t.id}
            onClick={() => {
              onDetailTabChange(t.id);
              setTabError(null);
            }}
          >
            {t.label}
          </NotebookTab>
        ))}
      </nav>

      {tabError && <ErrorState message={tabError} />}

      {tab === "overview" && (
        <>
          {heroCatalog && (
            <MonsterImageGallery
              heroUrl={heroCatalog.largeRenderImage}
              images={heroCatalog.images}
              alt={monster.name}
            />
          )}
          {catalogLoading && <p className="text-sm text-ink-muted">Loading reference data…</p>}
          {family && (
            <p className="text-sm text-ink-muted">
              Reference: {family.games.map((g) => g.game.replace("monster-hunter", "MH")).join(", ")}
            </p>
          )}
          <MonsterHuntStatsSection
            monster={monster}
            onPatchStats={async (patch) => {
              const updated = await api.patchMonsterStats(monster.id, patch);
              setMonster(updated);
            }}
            onHunt={async () => {
              const updated = await api.huntAction(monster.id);
              setMonster(updated);
            }}
            onCaptured={async () => {
              const updated = await api.capturedAction(monster.id);
              setMonster(updated);
            }}
            onQuestFailed={async () => {
              const updated = await api.questFailedAction(monster.id);
              setMonster(updated);
            }}
          />
          <NotebookSection title="Notes">
            <NotebookCard>
              <p className="text-sm text-ink">{monster.notes ?? "No notes yet."}</p>
            </NotebookCard>
          </NotebookSection>
        </>
      )}

      {tab === "world" && catalogDetails["monster-hunter"]?.riseData && (
        <RiseReferencePanel data={catalogDetails["monster-hunter"].riseData!} />
      )}

      {tab === "rise" && catalogDetails["monster-hunter-rise"]?.riseData && (
        <RiseReferencePanel data={catalogDetails["monster-hunter-rise"].riseData!} />
      )}

      {tab === "wilds" && catalogDetails["monster-hunter-wilds"]?.wildsData && (
        <WildsReferencePanel data={catalogDetails["monster-hunter-wilds"].wildsData!} />
      )}

      {tab === "tracker" && (
        <div className="space-y-8">
          <NotebookSection title="Weaknesses">
            <form
              className="flex flex-wrap gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                const name = newBodyPartName.trim();
                if (!name) return;
                void runTabAction(async () => {
                  await api.createBodyPart(monster.id, name);
                  setNewBodyPartName("");
                  await reload();
                });
              }}
            >
              <NotebookInput
                placeholder="New body part name"
                value={newBodyPartName}
                onChange={(e) => setNewBodyPartName(e.target.value)}
                disabled={tabBusy}
                className="min-w-[12rem] flex-1"
              />
              <NotebookButton type="submit" disabled={tabBusy || !newBodyPartName.trim()}>
                Add part
              </NotebookButton>
            </form>
            <WeaknessMatrix
              bodyParts={mh.bodyParts}
              weaknesses={mh.weaknesses}
              onUpdateCell={async (bodyPartId, field, value) => {
                const updated = await api.patchWeakness(monster.id, { bodyPartId, [field]: value });
                setMh((prev) =>
                  prev
                    ? { ...prev, weaknesses: prev.weaknesses.map((w) => (w.bodyPartId === bodyPartId ? updated : w)) }
                    : prev,
                );
              }}
              onDeleteBodyPart={(bodyPartId) => {
                void runTabAction(async () => {
                  await api.deleteBodyPart(monster.id, bodyPartId);
                  await reload();
                });
              }}
            />
          </NotebookSection>

          <NotebookSection title="Ailments">
            <form
              className="flex flex-wrap gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                const name = newAilmentName.trim();
                if (!name) return;
                void runTabAction(async () => {
                  await api.createAilment(monster.id, name);
                  setNewAilmentName("");
                  await reload();
                });
              }}
            >
              <NotebookInput
                placeholder="New custom ailment"
                value={newAilmentName}
                onChange={(e) => setNewAilmentName(e.target.value)}
                disabled={tabBusy}
                className="min-w-[12rem] flex-1"
              />
              <NotebookButton type="submit" disabled={tabBusy || !newAilmentName.trim()}>
                Add ailment
              </NotebookButton>
            </form>
            <AilmentResistanceList
              ailments={mh.ailments}
              onUpdate={async (ailmentId, field, value) => {
                const updated = await api.updateAilment(monster.id, ailmentId, { [field]: value });
                setMh((prev) =>
                  prev ? { ...prev, ailments: prev.ailments.map((a) => (a.id === ailmentId ? updated : a)) } : prev,
                );
              }}
              onDeleteAilment={(ailmentId) => {
                void runTabAction(async () => {
                  await api.deleteAilment(monster.id, ailmentId);
                  await reload();
                });
              }}
            />
          </NotebookSection>
        </div>
      )}

      {tab === "settings" && (
        <div className="space-y-6">
          <label className="flex min-h-[44px] items-center gap-2 text-ink">
            <input
              type="checkbox"
              checked={monster.canBeCaptured}
              onChange={async (e) => {
                const updated = await api.updateMonster(monster.id, { canBeCaptured: e.target.checked });
                setMonster(updated);
              }}
            />
            <span>Can be captured</span>
          </label>

          {catalogId && (
            <NotebookCard>
              <h3 className="font-hand text-xl text-ink">Sync from bestiary</h3>
              <p className="mb-3 text-sm text-ink-muted">
                Reload weaknesses and ailments from the catalog entry.
              </p>
              <NotebookButton
                disabled={refreshing}
                onClick={() => {
                  void runTabAction(async () => {
                    setRefreshing(true);
                    try {
                      await api.refreshFromCatalog(monster.id);
                      await reload();
                    } finally {
                      setRefreshing(false);
                    }
                  });
                }}
              >
                {refreshing ? "Syncing…" : "Refresh from catalog"}
              </NotebookButton>
            </NotebookCard>
          )}

          <NotebookCard className="border-wax/40">
            <h3 className="font-hand text-xl text-wax">Danger zone</h3>
            <p className="mb-3 text-sm text-ink-muted">
              Permanently remove {monster.name} and all hunt data.
            </p>
            <NotebookButton
              variant="danger"
              disabled={deleting}
              onClick={async () => {
                if (!window.confirm(`Delete ${monster.name}? This cannot be undone.`)) return;
                setDeleting(true);
                setTabError(null);
                try {
                  await api.deleteMonster(monster.id);
                  onBack();
                } catch (err) {
                  setTabError(err instanceof Error ? err.message : "Failed to delete monster");
                  setDeleting(false);
                }
              }}
            >
              {deleting ? "Deleting…" : "Delete monster"}
            </NotebookButton>
          </NotebookCard>
        </div>
      )}

      {tab === "log" && (
        <NotebookSection title="Drop history">
          <ul className="space-y-2">
            {drops.length === 0 && <li className="text-ink-muted">No drops recorded.</li>}
            {drops.map((drop) => (
              <li key={drop.id}>
                <NotebookCard className="py-2 text-sm">
                  {drop.dropName} × {drop.quantity} ({drop.rarity})
                </NotebookCard>
              </li>
            ))}
          </ul>
        </NotebookSection>
      )}
    </div>
  );
}
