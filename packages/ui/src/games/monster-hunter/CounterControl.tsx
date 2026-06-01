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
    <div className="rounded-lg bg-slate-800/80 p-3">
      <p className="text-xs uppercase tracking-wide text-slate-400">{label}</p>
      <div className="mt-1 flex items-center gap-2">
        {onDecrement && (
          <button
            type="button"
            onClick={onDecrement}
            className="rounded bg-slate-700 px-2 py-1 text-sm hover:bg-slate-600"
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
          className="w-16 rounded border border-slate-600 bg-slate-900 px-2 py-1 text-center text-lg font-semibold text-white"
        />
        <button
          type="button"
          onClick={onIncrement}
          className="rounded bg-emerald-700 px-2 py-1 text-sm hover:bg-emerald-600"
          aria-label={`Increase ${label}`}
        >
          +
        </button>
      </div>
    </div>
  );
}
