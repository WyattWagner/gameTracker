export function LoadingState({ message = "Loading..." }: { message?: string }) {
  return <p className="text-slate-300">{message}</p>;
}
