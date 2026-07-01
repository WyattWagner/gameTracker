import type { CatalogGameId } from "@game-tracker/shared";

export type AppView = "home" | "monsters" | "detail";

export type DetailTabId =
  | "overview"
  | "world"
  | "rise"
  | "wilds"
  | "tracker"
  | "settings"
  | "log";

export interface AppPreferences {
  view: AppView;
  selectedMonsterId: string | null;
  catalogGame: CatalogGameId;
  catalogSearch: string;
  monsterTypeFilter: string;
  weaknessFilter: string;
  catalogPage: number;
  monsterSearch: string;
  detailTab: DetailTabId;
  catalogFiltersOpen: boolean;
}

const STORAGE_KEY = "game-tracker-prefs";

export const DEFAULT_PREFERENCES: AppPreferences = {
  view: "home",
  selectedMonsterId: null,
  catalogGame: "monster-hunter",
  catalogSearch: "",
  monsterTypeFilter: "",
  weaknessFilter: "",
  catalogPage: 1,
  monsterSearch: "",
  detailTab: "overview",
  catalogFiltersOpen: false,
};

export function readPreferences(): AppPreferences {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_PREFERENCES };
    return { ...DEFAULT_PREFERENCES, ...JSON.parse(raw) };
  } catch {
    return { ...DEFAULT_PREFERENCES };
  }
}

export function writePreferences(prefs: AppPreferences): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
}

export function patchPreferences(patch: Partial<AppPreferences>): AppPreferences {
  const next = { ...readPreferences(), ...patch };
  writePreferences(next);
  return next;
}
