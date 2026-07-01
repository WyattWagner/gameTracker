import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { AppShell } from "./AppShell";

vi.mock("../pages/DashboardPage", () => ({
  DashboardPage: () => <div>Dashboard view</div>,
}));
vi.mock("../pages/MonstersPage", () => ({
  MonstersPage: () => <div>Monsters view</div>,
}));
vi.mock("../pages/MonsterDetailPage", () => ({
  MonsterDetailPage: () => <div>Detail view</div>,
}));

const mockNav = {
  prefs: {
    view: "home" as const,
    selectedMonsterId: null,
    catalogGame: "monster-hunter" as const,
    catalogSearch: "",
    monsterTypeFilter: "",
    weaknessFilter: "",
    catalogPage: 1,
    monsterSearch: "",
    detailTab: "overview" as const,
    catalogFiltersOpen: false,
  },
  view: "home" as const,
  selectedMonsterId: null,
  navigateHome: vi.fn(),
  navigateMonsters: vi.fn(),
  openMonster: vi.fn(),
  goBackFromDetail: vi.fn(),
  setDetailTab: vi.fn(),
  updatePrefs: vi.fn(),
  resetInvalidMonster: vi.fn(),
  defaults: {},
};

vi.mock("../hooks/useAppNavigation", () => ({
  useAppNavigation: () => mockNav,
}));

describe("AppShell", () => {
  it("renders home view and switches to monsters via bottom nav", () => {
    render(<AppShell />);
    expect(screen.getByText("Dashboard view")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Monsters" }));
    expect(mockNav.navigateMonsters).toHaveBeenCalled();
  });
});
