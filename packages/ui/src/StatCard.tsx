import type { ReactNode } from "react";

export function StatCard({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="notebook-stat-panel rounded-lg p-4">
      <p className="notebook-stat-label font-hand text-lg">{label}</p>
      <p className="notebook-stat-value mt-1 font-serif text-2xl font-semibold">{value}</p>
    </div>
  );
}
