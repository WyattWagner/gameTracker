import type { ReactNode } from "react";

export function BookCover({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`book-cover mx-auto flex min-h-dvh w-full max-w-lg flex-col ${className}`}>
      <div className="book-strap book-strap-top" aria-hidden />
      <div className="book-inner flex min-h-0 flex-1">
        <div className="book-spine" aria-hidden />
        <div className="book-page-area flex min-h-0 min-w-0 flex-1 flex-col">{children}</div>
      </div>
      <div className="book-strap book-strap-bottom" aria-hidden />
    </div>
  );
}

export function ParchmentPage({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`parchment-surface flex-1 px-4 py-4 ${className}`}>{children}</div>;
}
