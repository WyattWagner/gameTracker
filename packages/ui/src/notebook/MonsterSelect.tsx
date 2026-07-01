import type { CatalogGameId } from "@game-tracker/shared";
import type { SelectHTMLAttributes } from "react";

const GAME_ACCENT: Record<CatalogGameId, string> = {
  "monster-hunter": "notebook-monster-select--world",
  "monster-hunter-rise": "notebook-monster-select--rise",
  "monster-hunter-wilds": "notebook-monster-select--wilds",
};

export function MonsterSelect({
  gameId,
  label,
  id,
  className = "",
  ...props
}: SelectHTMLAttributes<HTMLSelectElement> & {
  gameId: CatalogGameId;
  label: string;
  id?: string;
}) {
  const selectId = id ?? `monster-select-${label.replace(/\s+/g, "-").toLowerCase()}`;
  return (
    <div className={`notebook-monster-select ${GAME_ACCENT[gameId]} ${className}`}>
      <label htmlFor={selectId} className="notebook-stat-label mb-1 block text-xs uppercase tracking-wide">
        {label}
      </label>
      <select
        id={selectId}
        className="mt-1 min-h-[44px] w-full rounded-md border border-paper/30 bg-leather-dark/60 px-3 py-2 text-paper focus:border-paper/50 focus:outline-none focus:ring-1 focus:ring-paper/40"
        {...props}
      />
    </div>
  );
}
