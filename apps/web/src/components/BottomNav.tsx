import type { AppView } from "../lib/preferences";

const tabs: { view: AppView; label: string; icon: string }[] = [
  { view: "home", label: "Home", icon: "📓" },
  { view: "monsters", label: "Monsters", icon: "🐾" },
];

export function BottomNav({
  activeView,
  onNavigate,
  detailOpen,
}: {
  activeView: AppView;
  onNavigate: (view: AppView) => void;
  detailOpen: boolean;
}) {
  const effectiveView = detailOpen ? "monsters" : activeView;

  return (
    <nav
      className="notebook-nav-leather fixed bottom-0 left-0 right-0 z-40 pb-[env(safe-area-inset-bottom)]"
      aria-label="Main navigation"
    >
      <div className="mx-auto flex max-w-lg">
        {tabs.map((tab) => {
          const isActive = effectiveView === tab.view;
          return (
            <button
              key={tab.view}
              type="button"
              onClick={() => onNavigate(tab.view)}
              className={`flex min-h-[56px] flex-1 flex-col items-center justify-center gap-0.5 text-xs font-medium transition-[filter] ${
                isActive ? "text-paper drop-shadow-sm" : "text-paper/70 hover:text-paper"
              }`}
            >
              <span
                className={`flex h-9 w-9 items-center justify-center rounded-full text-lg ${
                  isActive ? "bg-leather-dark/40 ring-1 ring-paper/30" : ""
                }`}
                aria-hidden
              >
                {tab.icon}
              </span>
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
