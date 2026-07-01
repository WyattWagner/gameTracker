export function ErrorState({ message }: { message: string }) {
  return (
    <p className="rounded-md border border-wax/40 bg-wax/10 p-3 text-sm text-wax">{message}</p>
  );
}
