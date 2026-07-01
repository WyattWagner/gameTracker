import { describe, expect, it, vi, afterEach } from "vitest";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MonsterDetailPage } from "./MonsterDetailPage";

const getMonster = vi.fn();
const getMhDetail = vi.fn();
const getCatalogFamily = vi.fn();
const getCatalogMonster = vi.fn();

const api = {
  getMonster,
  getMhDetail,
  getCatalogFamily,
  getCatalogMonster,
  patchMonsterStats: vi.fn(),
  huntAction: vi.fn(),
  capturedAction: vi.fn(),
  questFailedAction: vi.fn(),
  uploadMonsterImage: vi.fn(),
  deleteMonsterImage: vi.fn(),
  updateMonster: vi.fn(),
  patchWeakness: vi.fn(),
  updateAilment: vi.fn(),
  createBodyPart: vi.fn(),
  deleteBodyPart: vi.fn(),
  createAilment: vi.fn(),
  deleteAilment: vi.fn(),
  deleteMonster: vi.fn(),
  refreshFromCatalog: vi.fn(),
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

const defaultProps = {
  monsterId: "m1",
  onBack: vi.fn(),
  detailTab: "overview" as const,
  onDetailTabChange: vi.fn(),
  onInvalidMonster: vi.fn(),
};

describe("MonsterDetailPage", () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

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
      hunts: 3,
      wins: 2,
      losses: 1,
      captures: 1,
      failedQuests: 0,
      notes: "Fire wyvern",
      metadata: { familySlug: "rathalos" },
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

    getCatalogFamily.mockResolvedValue({
      familySlug: "rathalos",
      name: "Rathalos",
      games: [{ game: "monster-hunter-rise", monsterId: "cat1", name: "Rathalos" }],
    });
    getCatalogMonster.mockResolvedValue({
      id: "cat1",
      slug: "rathalos-rise",
      name: "Rathalos",
      species: "flying wyvern",
      description: null,
      game: "monster-hunter-rise",
      monsterType: "Flying Wyvern",
      threatLevel: 6,
      iconImage: null,
      largeRenderImage: "https://example.com/rath.png",
      familySlug: "rathalos",
      ecologyText: null,
      canBeCaptured: true,
      monsterSize: "large",
      riseData: {
        elementalWeaknesses: [{ element: "dragon", stars: 3 }],
        ailmentWeaknesses: [],
      },
      wildsData: null,
      materials: [],
      images: [],
    });

    const onDetailTabChange = vi.fn();
    const { rerender } = render(<MonsterDetailPage {...defaultProps} onDetailTabChange={onDetailTabChange} />);

    await waitFor(() => {
      expect(screen.getByRole("heading", { name: "Rathalos" })).toBeInTheDocument();
      expect(screen.getByText("Hunts")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole("button", { name: "Hunt log" }));
    rerender(<MonsterDetailPage {...defaultProps} detailTab="log" onDetailTabChange={onDetailTabChange} />);
    expect(screen.getByText("Rathalos Scale × 2 (COMMON)")).toBeInTheDocument();
  });

  it("shows delete monster control on settings tab", async () => {
    getMonster.mockResolvedValue({
      id: "m1",
      gameId: "monster-hunter",
      userId: "u1",
      name: "Rathalos",
      imageUrl: null,
      canBeCaptured: true,
      favoriteWeaponUsed: null,
      lastEncounterAt: null,
      numberOfHunts: 0,
      hunts: 0,
      wins: 0,
      losses: 0,
      captures: 0,
      failedQuests: 0,
      notes: null,
      metadata: null,
    });
    getMhDetail.mockResolvedValue({
      bodyParts: [],
      weaknesses: [],
      ailments: [],
      materials: [],
    });
    getCatalogFamily.mockResolvedValue({ familySlug: "rathalos", name: "Rathalos", games: [] });

    render(<MonsterDetailPage {...defaultProps} detailTab="settings" />);

    await waitFor(() => expect(screen.getByRole("heading", { name: "Rathalos" })).toBeInTheDocument());
    expect(screen.getByRole("button", { name: "Delete monster" })).toBeInTheDocument();
  });
});
