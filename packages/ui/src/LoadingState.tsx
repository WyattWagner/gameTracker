export function LoadingState({ message = "Flipping pages…" }: { message?: string }) {
  return <p className="text-ink-muted">{message}</p>;
}
