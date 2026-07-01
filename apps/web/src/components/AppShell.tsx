import { DashboardPage } from "../pages/DashboardPage";
import { MonsterDetailPage } from "../pages/MonsterDetailPage";
import { MonstersPage } from "../pages/MonstersPage";
import { useAppNavigation } from "../hooks/useAppNavigation";
import { useParchmentTexture } from "../hooks/useParchmentTexture";
import { BookCover, ParchmentPage } from "./book/BookCover";
import { BottomNav } from "./BottomNav";

export function AppShell() {
  const nav = useAppNavigation();
  useParchmentTexture();

  return (
    <BookCover>
      <header className="book-header sticky top-0 z-30 px-4 pb-3 pt-[max(0.75rem,env(safe-area-inset-top))]">
        {nav.view === "detail" && nav.selectedMonsterId ? (
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={nav.goBackFromDetail}
              className="min-h-[44px] min-w-[44px] rounded-md border border-rust/40 px-3 text-sm text-ink hover:border-moss"
              aria-label="Back to monsters"
            >
              ← Back
            </button>
            <h1 className="font-serif text-lg font-bold text-ink">Field Notes</h1>
          </div>
        ) : (
          <div className="book-title-plate rounded-md px-3 py-2">
            <p className="font-hand text-sm text-paper/80">Hunter&apos;s Field Journal</p>
            <h1 className="font-serif text-xl font-bold text-paper">
              {nav.view === "home" ? "Expedition Log" : "Monster Index"}
            </h1>
          </div>
        )}
      </header>

      <ParchmentPage className="pb-24">
        {nav.view === "home" && <DashboardPage onOpenMonster={nav.openMonster} />}
        {nav.view === "monsters" && <MonstersPage nav={nav} onOpenMonster={nav.openMonster} />}
        {nav.view === "detail" && nav.selectedMonsterId && (
          <MonsterDetailPage
            monsterId={nav.selectedMonsterId}
            onBack={nav.goBackFromDetail}
            detailTab={nav.prefs.detailTab}
            onDetailTabChange={nav.setDetailTab}
            onInvalidMonster={nav.resetInvalidMonster}
          />
        )}
      </ParchmentPage>

      <BottomNav
        activeView={nav.view}
        onNavigate={(view) => (view === "home" ? nav.navigateHome() : nav.navigateMonsters())}
        detailOpen={nav.view === "detail"}
      />
    </BookCover>
  );
}
