import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
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
  const { api } = useAuth();
  const [monster, setMonster] = useState<Monster | null>(null);
  const [mh, setMh] = useState<MonsterHunterDetail | null>(null);
  const [tab, setTab] = useState<TabId>("overview");
  const [materialRank, setMaterialRank] = useState<MaterialRank>("LOW");
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
            onClick={() => setTab(t.id)}
            className={`rounded-md px-3 py-1.5 text-sm ${
              tab === t.id ? "bg-slate-700 text-white" : "text-slate-400 hover:text-white"
            }`}
          >
            {t.label}
          </button>
        ))}
      </nav>

      {tab === "overview" && (
        <>
          <MonsterHuntStatsSection
            monster={monster}
            onPatchStats={async (patch) => {
              const updated = await api.patchMonsterStats(monster.id, patch);
              setMonster(updated);
            }}
            onHunted={async () => {
              const updated = await api.huntedAction(monster.id);
              setMonster(updated);
            }}
            onCaptured={async () => {
              const updated = await api.capturedAction(monster.id);
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
        />
      )}

      {tab === "ailments" && (
        <AilmentResistanceList
          ailments={mh.ailments}
          onUpdate={async (ailmentId, field, value) => {
            const updated = await api.updateAilment(monster.id, ailmentId, { [field]: value });
            setMh((prev) =>
              prev ? { ...prev, ailments: prev.ailments.map((a) => (a.id === ailmentId ? updated : a)) } : prev,
            );
          }}
        />
      )}

      {tab === "materials" && (
        <div className="space-y-4">
          <RankTabs rank={materialRank} onChange={setMaterialRank} />
          {materialRank === "HIGH" && materialsForRank.length === 0 && (
            <button
              type="button"
              className="rounded bg-emerald-800 px-3 py-2 text-sm"
              onClick={async () => {
                const res = await api.initializeMaterialRank(monster.id, "LOW", "HIGH");
                setMh((prev) => (prev ? { ...prev, materials: [...prev.materials.filter((m) => m.rank !== "HIGH"), ...res.materials] } : prev));
              }}
            >
              Initialize High Rank from Low
            </button>
          )}
          {materialRank === "MASTER" && materialsForRank.length === 0 && (
            <button
              type="button"
              className="rounded bg-emerald-800 px-3 py-2 text-sm"
              onClick={async () => {
                const res = await api.initializeMaterialRank(monster.id, "HIGH", "MASTER");
                setMh((prev) =>
                  prev ? { ...prev, materials: [...prev.materials.filter((m) => m.rank !== "MASTER"), ...res.materials] } : prev,
                );
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

          <section>
            <h3 className="mb-2 font-medium">Body parts</h3>
            <ul className="mb-2 space-y-1 text-sm">
              {mh.bodyParts.map((p) => (
                <li key={p.id} className="flex gap-2">
                  {p.name}
                  <button
                    type="button"
                    className="text-red-400"
                    onClick={async () => {
                      await api.deleteBodyPart(monster.id, p.id);
                      await reload();
                    }}
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
            <button
              type="button"
              className="rounded bg-slate-700 px-3 py-1 text-sm"
              onClick={async () => {
                const name = window.prompt("Body part name");
                if (!name) return;
                await api.createBodyPart(monster.id, name);
                await reload();
              }}
            >
              Add body part
            </button>
          </section>

          <section>
            <h3 className="mb-2 font-medium">Custom ailments</h3>
            <ul className="mb-2 space-y-1 text-sm">
              {mh.ailments
                .filter((a) => a.isCustom)
                .map((a) => (
                  <li key={a.id} className="flex gap-2">
                    {a.name}
                    <button
                      type="button"
                      className="text-red-400"
                      onClick={async () => {
                        await api.deleteAilment(monster.id, a.id);
                        await reload();
                      }}
                    >
                      Delete
                    </button>
                  </li>
                ))}
            </ul>
            <button
              type="button"
              className="rounded bg-slate-700 px-3 py-1 text-sm"
              onClick={async () => {
                const name = window.prompt("Ailment name");
                if (!name) return;
                await api.createAilment(monster.id, name);
                await reload();
              }}
            >
              Add custom ailment
            </button>
          </section>

          <section>
            <h3 className="mb-2 font-medium">Materials ({materialRank})</h3>
            <button
              type="button"
              className="rounded bg-slate-700 px-3 py-1 text-sm"
              onClick={async () => {
                const name = window.prompt("Material name");
                if (!name) return;
                await api.createMaterial(monster.id, { rank: materialRank, name });
                await reload();
              }}
            >
              Add material
            </button>
            <div className="mt-2">
              <RankTabs rank={materialRank} onChange={setMaterialRank} />
            </div>
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
