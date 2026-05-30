import { ErrorState, LoadingState, StatCard } from "@game-tracker/ui";
import { useDashboardStats } from "../hooks/useDashboardStats";

export function DashboardPage() {
  const { data, loading, error } = useDashboardStats();

  if (loading) return <LoadingState message="Loading dashboard..." />;
  if (error) return <ErrorState message={error} />;
  if (!data) return null;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Dashboard</h2>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <StatCard label="Quests Completed" value={data.totalQuestsCompleted} />
        <StatCard label="Total Hunts" value={data.totalHunts} />
        <StatCard label="Monsters Defeated" value={data.monstersDefeated} />
        <StatCard label="Monsters Captured" value={data.monstersCaptured} />
        <StatCard label="Failed Against" value={data.monstersFailedAgainst} />
        <StatCard label="Most Hunted" value={data.mostHuntedMonster?.name ?? "—"} />
        <StatCard label="Rarest Drop" value={data.rarestDropObtained?.dropName ?? "—"} />
      </div>

      <section>
        <h3 className="mb-3 text-lg font-medium">Recent Activity</h3>
        <ul className="space-y-2">
          {data.recentActivity.length === 0 && <li className="text-slate-400">No activity yet.</li>}
          {data.recentActivity.map((item) => (
            <li key={item.id} className="rounded-md border border-slate-800 bg-slate-900/50 px-3 py-2 text-sm">
              <span className="text-emerald-300">{item.type}</span> — {item.summary}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
