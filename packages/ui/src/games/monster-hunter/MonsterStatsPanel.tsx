import type { Monster } from "@game-tracker/shared";

/** Monster Hunter-specific fields rendered via game module composition. */
export function MonsterStatsPanel({ monster }: { monster: Monster }) {
  const stats = [
    { label: "Quests Accepted", value: monster.numberOfHunts },
    { label: "Hunts", value: monster.hunts },
    { label: "Quests Completed", value: monster.wins },
    { label: "Captures", value: monster.captures },
    { label: "Failed Quests", value: monster.failedQuests },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
      {stats.map((stat) => (
        <div key={stat.label} className="rounded-lg bg-slate-800/80 p-3">
          <p className="text-xs uppercase tracking-wide text-slate-400">{stat.label}</p>
          <p className="text-lg font-semibold text-white">{stat.value}</p>
        </div>
      ))}
    </div>
  );
}
