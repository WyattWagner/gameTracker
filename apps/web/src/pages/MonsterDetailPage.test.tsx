import { describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { MonsterDetailPage } from "./MonsterDetailPage";

const getMonster = vi.fn();
const getMhDetail = vi.fn();

const api = {
  getMonster,
  getMhDetail,
  patchMonsterStats: vi.fn(),
  huntedAction: vi.fn(),
  capturedAction: vi.fn(),
  uploadMonsterImage: vi.fn(),
  deleteMonsterImage: vi.fn(),
  updateMonster: vi.fn(),
  patchWeakness: vi.fn(),
  updateAilment: vi.fn(),
  updateMaterial: vi.fn(),
  addMaterialBodyPartDrop: vi.fn(),
  removeMaterialBodyPartDrop: vi.fn(),
  initializeMaterialRank: vi.fn(),
  createBodyPart: vi.fn(),
  deleteBodyPart: vi.fn(),
  createAilment: vi.fn(),
  deleteAilment: vi.fn(),
  createMaterial: vi.fn(),
};

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
  it("shows hunt stats on overview and drops on hunt log tab", async () => {
    getMonster.mockResolvedValue({
      id: "m1",
      gameId: "monster-hunter",
      userId: "u1",
      name: "Rathalos",
      imageUrl: null,
      canBeCaptured: true,
      favoriteWeaponUsed: "Long Sword",
      lastEncounterAt: null,
      numberOfHunts: 4,
      wins: 2,
      losses: 1,
      captures: 1,
      failedQuests: 0,
      notes: "Fire wyvern",
    });

    getMhDetail.mockResolvedValue({
      bodyParts: [{ id: "bp1", monsterId: "m1", name: "Head", sortOrder: 0 }],
      weaknesses: [
        {
          id: "w1",
          monsterId: "m1",
          bodyPartId: "bp1",
          slash: 0,
          blunt: 0,
          pierce: 0,
          fire: 0,
          water: 0,
          thunder: 0,
          ice: 0,
          dragon: 0,
        },
      ],
      ailments: [],
      materials: [],
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

    await screen.findByRole("button", { name: "Hunt log" }).then((btn) => btn.click());
    expect(screen.getByText("Rathalos Scale × 2 (COMMON)")).toBeInTheDocument();
  });
});
