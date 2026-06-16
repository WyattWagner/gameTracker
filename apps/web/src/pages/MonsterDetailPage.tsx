import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  AilmentResistanceList,
  ErrorState,
  LoadingState,
  MaterialDropMatrix,
  MonsterHuntStatsSection,
  RankTabs,
  WeaknessMatrix,
} from "@game-tracker/ui";
import type { MaterialRank, Monster, MonsterHunterDetail } from "@game-tracker/shared";
import { useAuth } from "../api/AuthContext";
import { useDrops } from "../hooks/useDrops";

type TabId = "overview" | "weaknesses" | "ailments" | "materials" | "settings" | "log";

function imageSrc(url: string | null): string {
  if (!url) return "https://placehold.co/120x120/1e293b/94a3b8?text=Monster";
  if (url.startsWith("/")) return url;
  return url;
}

export function MonsterDetailPage() {
  const { monsterId } = useParams();
  const navigate = useNavigate();
  const { api } = useAuth();
  const [monster, setMonster] = useState<Monster | null>(null);
  const [mh, setMh] = useState<MonsterHunterDetail | null>(null);
  const [tab, setTab] = useState<TabId>("overview");
  const [materialRank, setMaterialRank] = useState<MaterialRank>("LOW");
  const [newBodyPartName, setNewBodyPartName] = useState("");
  const [newAilmentName, setNewAilmentName] = useState("");
  const [newMaterialName, setNewMaterialName] = useState("");
  const [tabError, setTabError] = useState<string | null>(null);
  const [tabBusy, setTabBusy] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { drops } = useDrops("monster-hunter", monsterId);

  const reload = useCallback(async () => {
    if (!monsterId) return;
    const [m, detail] = await Promise.all([api.getMonster(monsterId), api.getMhDetail(monsterId)]);
    setMonster(m);
    setMh(detail);
  }, [api, monsterId]);

  useEffect(() => {
    if (!monsterId) return;
    setLoading(true);
    reload()
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load monster"))
      .finally(() => setLoading(false));
  }, [monsterId, reload]);

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

  if (loading) return <LoadingState message="Loading monster..." />;
  if (error) return <ErrorState message={error} />;
  if (!monster || !mh) return null;

  const materialsForRank = mh.materials.filter((m) => m.rank === materialRank);

  const tabs: { id: TabId; label: string }[] = [
    { id: "overview", label: "Overview" },
    { id: "weaknesses", label: "Weaknesses" },
    { id: "ailments", label: "Ailments" },
    { id: "materials", label: "Materials" },
    { id: "settings", label: "Settings" },
    { id: "log", label: "Hunt log" },
  ];

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-start gap-4">
        <div className="relative">
          <img src={imageSrc(monster.imageUrl)} alt={monster.name} className="h-24 w-24 rounded-lg border border-slate-700 object-cover" />
          <label className="mt-2 block cursor-pointer text-xs text-emerald-400 hover:text-emerald-300">
            Upload image
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file || !monsterId) return;
                const updated = await api.uploadMonsterImage(monsterId, file);
                setMonster(updated);
              }}
            />
          </label>
          {monster.imageUrl && (
            <button
              type="button"
              className="mt-1 block text-xs text-red-400"
              onClick={async () => {
                if (!monsterId) return;
                const updated = await api.deleteMonsterImage(monsterId);
                setMonster(updated);
              }}
            >
              Remove image
            </button>
          )}
        </div>
        <div>
          <h2 className="text-2xl font-semibold">{monster.name}</h2>
          <p className="text-sm text-slate-400">Game: {monster.gameId}</p>
        </div>
      </header>

      <nav className="flex flex-wrap gap-2 border-b border-slate-800 pb-2">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => {
              setTab(t.id);
              setTabError(null);
            }}
            className={`rounded-md px-3 py-1.5 text-sm ${
              tab === t.id ? "bg-slate-700 text-white" : "text-slate-400 hover:text-white"
            }`}
          >
            {t.label}
          </button>
        ))}
      </nav>

      {tabError && <ErrorState message={tabError} />}

      {tab === "overview" && (
        <>
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
          <section>
            <h3 className="mb-2 text-lg font-medium">Notes</h3>
            <p className="rounded-md border border-slate-800 bg-slate-900/50 p-3 text-sm text-slate-300">
              {monster.notes ?? "No notes yet."}
            </p>
          </section>
        </>
      )}

      {tab === "weaknesses" && (
        <div className="space-y-4">
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
            <input
              className="rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm"
              placeholder="New body part name"
              value={newBodyPartName}
              onChange={(e) => setNewBodyPartName(e.target.value)}
              disabled={tabBusy}
            />
            <button
              type="submit"
              className="rounded-md bg-emerald-700 px-3 py-2 text-sm hover:bg-emerald-600 disabled:opacity-50"
              disabled={tabBusy || !newBodyPartName.trim()}
            >
              Add body part
            </button>
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
        </div>
      )}

      {tab === "ailments" && (
        <div className="space-y-4">
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
            <input
              className="rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm"
              placeholder="New custom ailment name"
              value={newAilmentName}
              onChange={(e) => setNewAilmentName(e.target.value)}
              disabled={tabBusy}
            />
            <button
              type="submit"
              className="rounded-md bg-emerald-700 px-3 py-2 text-sm hover:bg-emerald-600 disabled:opacity-50"
              disabled={tabBusy || !newAilmentName.trim()}
            >
              Add ailment
            </button>
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
        </div>
      )}

      {tab === "materials" && (
        <div className="space-y-4">
          <RankTabs rank={materialRank} onChange={setMaterialRank} />
          <form
            className="flex flex-wrap gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              const name = newMaterialName.trim();
              if (!name) return;
              void runTabAction(async () => {
                await api.createMaterial(monster.id, { rank: materialRank, name });
                setNewMaterialName("");
                await reload();
              });
            }}
          >
            <input
              className="rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm"
              placeholder={`New ${materialRank.toLowerCase()} rank material`}
              value={newMaterialName}
              onChange={(e) => setNewMaterialName(e.target.value)}
              disabled={tabBusy}
            />
            <button
              type="submit"
              className="rounded-md bg-emerald-700 px-3 py-2 text-sm hover:bg-emerald-600 disabled:opacity-50"
              disabled={tabBusy || !newMaterialName.trim()}
            >
              Add material
            </button>
          </form>
          {materialRank === "HIGH" && materialsForRank.length === 0 && (
            <button
              type="button"
              className="rounded bg-emerald-800 px-3 py-2 text-sm"
              disabled={tabBusy}
              onClick={() => {
                void runTabAction(async () => {
                  const res = await api.initializeMaterialRank(monster.id, "LOW", "HIGH");
                  setMh((prev) =>
                    prev ? { ...prev, materials: [...prev.materials.filter((m) => m.rank !== "HIGH"), ...res.materials] } : prev,
                  );
                });
              }}
            >
              Initialize High Rank from Low
            </button>
          )}
          {materialRank === "MASTER" && materialsForRank.length === 0 && (
            <button
              type="button"
              className="rounded bg-emerald-800 px-3 py-2 text-sm"
              disabled={tabBusy}
              onClick={() => {
                void runTabAction(async () => {
                  const res = await api.initializeMaterialRank(monster.id, "HIGH", "MASTER");
                  setMh((prev) =>
                    prev ? { ...prev, materials: [...prev.materials.filter((m) => m.rank !== "MASTER"), ...res.materials] } : prev,
                  );
                });
              }}
            >
              Initialize Master Rank from High
            </button>
          )}
          <MaterialDropMatrix
            materials={materialsForRank}
            bodyParts={mh.bodyParts}
            onUpdateReward={async (materialId, field, value) => {
              const updated = await api.updateMaterial(monster.id, materialId, { [field]: value });
              setMh((prev) =>
                prev ? { ...prev, materials: prev.materials.map((m) => (m.id === materialId ? updated : m)) } : prev,
              );
            }}
            onAddBodyPartDrop={async (materialId, bodyPartId, chance) => {
              await api.addMaterialBodyPartDrop(monster.id, materialId, bodyPartId, chance);
              const detail = await api.getMhDetail(monster.id);
              setMh(detail);
            }}
            onRemoveBodyPartDrop={async (materialId, bodyPartId) => {
              await api.removeMaterialBodyPartDrop(monster.id, materialId, bodyPartId);
              const detail = await api.getMhDetail(monster.id);
              setMh(detail);
            }}
          />
        </div>
      )}

      {tab === "settings" && (
        <div className="space-y-6">
          <label className="flex items-center gap-2">
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

          <section className="rounded-lg border border-red-900/50 bg-red-950/20 p-4">
            <h3 className="mb-2 font-medium text-red-300">Danger zone</h3>
            <p className="mb-3 text-sm text-slate-400">
              Permanently remove {monster.name} and all hunt data, weaknesses, materials, and images.
            </p>
            <button
              type="button"
              disabled={deleting}
              className="rounded-md bg-red-700 px-3 py-2 text-sm hover:bg-red-600 disabled:opacity-50"
              onClick={async () => {
                if (!window.confirm(`Delete ${monster.name}? This cannot be undone.`)) return;
                setDeleting(true);
                setTabError(null);
                try {
                  await api.deleteMonster(monster.id);
                  navigate("/monsters");
                } catch (err) {
                  setTabError(err instanceof Error ? err.message : "Failed to delete monster");
                  setDeleting(false);
                }
              }}
            >
              {deleting ? "Deleting…" : "Delete monster"}
            </button>
          </section>
        </div>
      )}

      {tab === "log" && (
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
      )}
    </div>
  );
}
