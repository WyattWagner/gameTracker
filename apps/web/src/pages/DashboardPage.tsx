import { ErrorState, LoadingState, NotebookCard, StatCard } from "@game-tracker/ui";
import { useDashboardStats } from "../hooks/useDashboardStats";

export function DashboardPage({ onOpenMonster }: { onOpenMonster?: (id: string) => void }) {
  const { data, loading, error } = useDashboardStats();

  if (loading) return <LoadingState message="Opening expedition log…" />;
  if (error) return <ErrorState message={error} />;
  if (!data) return null;

  return (
    <div className="space-y-6">
      <div className="grid gap-3 sm:grid-cols-2">
        <StatCard label="Quests Completed" value={data.totalQuestsCompleted} />
        <StatCard label="Quests Accepted" value={data.totalQuestsAccepted ?? 0} />
        <StatCard label="Total Hunts" value={data.totalHunts ?? 0} />
        <StatCard label="Monsters Defeated" value={data.monstersDefeated} />
        <StatCard label="Monsters Captured" value={data.monstersCaptured} />
        <StatCard label="Failed Quests" value={data.monstersFailedAgainst} />
        <StatCard label="Most Hunts" value={data.mostHuntedMonster?.name ?? "—"} />
        <StatCard label="Rarest Drop" value={data.rarestDropObtained?.dropName ?? "—"} />
      </div>

      <section>
        <h3 className="mb-3 font-hand text-2xl text-ink">Recent activity</h3>
        <ul className="space-y-2">
          {data.recentActivity.length === 0 && <li className="text-ink-muted">No activity yet.</li>}
          {data.recentActivity.map((item) => (
            <li key={item.id}>
              <NotebookCard className="py-2 text-sm">
                <span className="font-medium text-moss">{item.type}</span> — {item.summary}
              </NotebookCard>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
