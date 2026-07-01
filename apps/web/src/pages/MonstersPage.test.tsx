import { describe, expect, it, vi, afterEach } from "vitest";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MonstersPage } from "./MonstersPage";

const listMonsters = vi.fn();
const listCatalogMonsters = vi.fn();
const createMonster = vi.fn();
const createMonsterFromCatalog = vi.fn();

const api = {
  listMonsters,
  listCatalogMonsters,
  createMonster,
  createMonsterFromCatalog,
};

vi.mock("../api/AuthContext", () => ({
  useAuth: () => ({ api, token: "test-token" }),
}));

const updatePrefs = vi.fn();
const onOpenMonster = vi.fn();

const baseNav = {
  prefs: {
    catalogGame: "monster-hunter-rise" as const,
    catalogSearch: "",
    monsterTypeFilter: "",
    weaknessFilter: "",
    catalogPage: 1,
    monsterSearch: "",
    catalogFiltersOpen: false,
    view: "monsters" as const,
    selectedMonsterId: null,
    detailTab: "overview" as const,
  },
  updatePrefs,
};

describe("MonstersPage", () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it("loads catalog and tracked monsters for the active game tab", async () => {
    listCatalogMonsters.mockResolvedValue({
      monsters: [{ id: "mhr-magnamalo", name: "Magnamalo" }],
      total: 1,
      gameTitle: "Monster Hunter Rise (+ Sunbreak)",
      sourceUrl: "https://example.com",
    });
    listMonsters.mockResolvedValue({
      monsters: [{ id: "t1", name: "Magnamalo", hunts: 3 }],
      total: 1,
    });

    render(<MonstersPage nav={baseNav as never} onOpenMonster={onOpenMonster} />);

    await waitFor(() => {
      expect(listCatalogMonsters).toHaveBeenCalledWith(
        expect.stringContaining("gameId=monster-hunter-rise"),
      );
      expect(listMonsters).toHaveBeenCalledWith(
        expect.stringContaining("gameId=monster-hunter-rise"),
      );
    });

    expect(screen.getByLabelText(/Add from catalog/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Open monster/i)).toBeInTheDocument();
    expect(screen.getByText(/Magnamalo — 3 hunts/)).toBeInTheDocument();
  });

  it("creates custom monsters with the active game id", async () => {
    listCatalogMonsters.mockResolvedValue({ monsters: [], total: 0, gameTitle: "", sourceUrl: "" });
    listMonsters.mockResolvedValue({ monsters: [], total: 0 });
    createMonster.mockResolvedValue({ id: "new", name: "Custom", hunts: 0 });

    render(<MonstersPage nav={baseNav as never} onOpenMonster={onOpenMonster} />);

    await waitFor(() => expect(listMonsters).toHaveBeenCalled());

    fireEvent.change(screen.getByPlaceholderText("Custom monster name"), { target: { value: "Custom" } });
    fireEvent.click(screen.getByRole("button", { name: "Add custom" }));

    await waitFor(() => {
      expect(createMonster).toHaveBeenCalledWith({
        gameId: "monster-hunter-rise",
        name: "Custom",
      });
    });
  });
});
