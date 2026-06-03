import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { DashboardPage } from "./DashboardPage";

vi.mock("../hooks/useDashboardStats", () => ({
  useDashboardStats: () => ({
    loading: false,
    error: null,
    data: {
      totalQuestsCompleted: 2,
      totalQuestsAccepted: 7,
      totalHunts: 5,
      monstersDefeated: 3,
      monstersCaptured: 1,
      monstersFailedAgainst: 1,
      mostHuntedMonster: { id: "1", name: "Rathalos", hunts: 3 },
      rarestDropObtained: null,
      recentActivity: [{ id: "a1", type: "ENCOUNTER", summary: "WIN encounter", occurredAt: "2026-01-01T00:00:00.000Z" }],
    },
  }),
}));

describe("DashboardPage", () => {
  it("renders dashboard cards and recent activity", () => {
    render(<DashboardPage />);
    expect(screen.getByText("Quests Accepted")).toBeInTheDocument();
    expect(screen.getByText("Total Hunts")).toBeInTheDocument();
    expect(screen.getByText("7")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();
    expect(screen.getByText(/WIN encounter/)).toBeInTheDocument();
  });
});
