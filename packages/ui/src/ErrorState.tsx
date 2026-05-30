export function ErrorState({ message }: { message: string }) {
  return <p className="rounded-md border border-red-800 bg-red-950/40 p-3 text-red-200">{message}</p>;
}
