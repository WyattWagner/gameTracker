import { describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { MonsterDetailPage } from "./MonsterDetailPage";

const getMonster = vi.fn();
const api = { getMonster };

vi.mock("../api/AuthContext", () => ({
  useAuth: () => ({ api }),
}));

vi.mock("../hooks/useDrops", () => ({
  useDrops: () => ({
    drops: [{ id: "d1", dropName: "Rathalos Scale", quantity: 2, rarity: "COMMON" }],
    loading: false,
    error: null,
  }),
}));

describe("MonsterDetailPage", () => {
  it("shows monster stats and drop history via modular panel", async () => {
    getMonster.mockResolvedValue({
      id: "m1",
      gameId: "monster-hunter",
      userId: "u1",
      name: "Rathalos",
      imageUrl: null,
      favoriteWeaponUsed: "Long Sword",
      lastEncounterAt: null,
      numberOfHunts: 4,
      wins: 2,
      losses: 1,
      captures: 1,
      failedQuests: 0,
      notes: "Fire wyvern",
    });

    render(
      <MemoryRouter initialEntries={["/monsters/m1"]}>
        <Routes>
          <Route path="/monsters/:monsterId" element={<MonsterDetailPage />} />
        </Routes>
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByRole("heading", { name: "Rathalos" })).toBeInTheDocument();
      expect(screen.getByText("Hunts")).toBeInTheDocument();
    });
    expect(screen.getByText("Rathalos Scale × 2 (COMMON)")).toBeInTheDocument();
  });
});
