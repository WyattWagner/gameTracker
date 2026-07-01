export function CounterControl({
  label,
  value,
  onIncrement,
  onDecrement,
  onSetValue,
}: {
  label: string;
  value: number;
  onIncrement: () => void;
  onDecrement?: () => void;
  onSetValue: (value: number) => void;
}) {
  return (
    <div className="notebook-stat-panel rounded-lg p-3">
      <p className="notebook-stat-label text-xs uppercase tracking-wide">{label}</p>
      <div className="mt-1 flex items-center gap-2">
        {onDecrement && (
          <button
            type="button"
            onClick={onDecrement}
            className="rounded-md border border-paper/30 bg-leather-dark/50 px-2 py-1 text-sm text-paper hover:bg-leather-dark/70"
            aria-label={`Decrease ${label}`}
          >
            −
          </button>
        )}
        <input
          type="number"
          min={0}
          value={value}
          onChange={(e) => onSetValue(Math.max(0, Number(e.target.value) || 0))}
          className="w-16 rounded-md border border-paper/40 bg-paper px-2 py-1 text-center text-lg font-semibold text-ink"
        />
        <button
          type="button"
          onClick={onIncrement}
          className="rounded-md bg-moss px-2 py-1 text-sm font-medium text-paper hover:bg-moss/90"
          aria-label={`Increase ${label}`}
        >
          +
        </button>
      </div>
    </div>
  );
}
