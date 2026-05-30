import { describe, expect, it, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { useDashboardStats } from "./useDashboardStats";

vi.mock("../api/AuthContext", () => ({
  useAuth: () => ({
    token: "token",
    api: {
      dashboardStats: vi.fn().mockResolvedValue({
        totalQuestsCompleted: 3,
        totalHunts: 10,
        monstersDefeated: 6,
        monstersCaptured: 2,
        monstersFailedAgainst: 2,
        mostHuntedMonster: null,
        rarestDropObtained: null,
        recentActivity: [],
      }),
    },
  }),
}));

describe("useDashboardStats", () => {
  beforeEach(() => vi.clearAllMocks());

  it("loads dashboard stats and exposes loading/error states", async () => {
    const { result } = renderHook(() => useDashboardStats());
    await waitFor(() => expect(result.current.data?.totalHunts).toBe(10));
    expect(result.current.error).toBeNull();
  });
});
