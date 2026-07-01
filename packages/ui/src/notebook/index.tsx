import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode } from "react";

const btnBase =
  "min-h-[44px] rounded-md px-4 py-2 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed";

export function NotebookCard({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={`notebook-card parchment-surface rounded-lg border border-rust/30 bg-paper/75 p-4 shadow-[2px_3px_8px_rgba(42,34,24,0.12)] ${className}`}
    >
      {children}
    </div>
  );
}

export function NotebookSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="space-y-3">
      <h3 className="font-hand text-2xl text-ink">{title}</h3>
      <div className="border-b border-rule" />
      {children}
    </section>
  );
}

export function NotebookButton({
  variant = "primary",
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "secondary" | "danger" }) {
  const styles =
    variant === "primary"
      ? "bg-moss text-paper shadow-sm hover:bg-moss/90"
      : variant === "danger"
        ? "bg-wax text-paper hover:bg-wax/90"
        : "border border-rust/50 bg-paper text-ink hover:border-moss";
  return <button className={`${btnBase} ${styles} ${className}`} {...props} />;
}

export function NotebookInput({ className = "", ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={`min-h-[44px] w-full rounded-md border border-rust/40 bg-paper px-3 py-2 text-ink placeholder:text-ink-muted focus:border-moss focus:outline-none focus:ring-1 focus:ring-moss ${className}`}
      {...props}
    />
  );
}

export function NotebookTab({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`shrink-0 rounded-md px-3 py-2 font-hand text-lg ${btnBase} min-h-[40px] ${
        active ? "bg-moss text-paper shadow-sm" : "border border-rust/30 bg-paper text-ink-muted hover:text-ink"
      }`}
    >
      {children}
    </button>
  );
}

export function NotebookPage({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`space-y-6 ${className}`}>{children}</div>;
}

export { MonsterSelect } from "./MonsterSelect";
