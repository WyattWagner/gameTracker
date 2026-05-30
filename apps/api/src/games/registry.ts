/** Game module registry — add new games without rewriting core routes. */
export interface GameModule {
  id: string;
  name: string;
  getMonsterFieldDefs: () => Array<{ key: string; label: string; type: "number" | "string" }>;
  getQuestRewardDefs?: () => Array<{ key: string; label: string; type: "number" | "string" | "list" }>;
}

export const monsterHunterModule: GameModule = {
  id: "monster-hunter",
  name: "Monster Hunter",
  getMonsterFieldDefs: () => [
    { key: "numberOfHunts", label: "Hunts", type: "number" },
    { key: "wins", label: "Wins", type: "number" },
    { key: "losses", label: "Losses", type: "number" },
    { key: "captures", label: "Captures", type: "number" },
    { key: "failedQuests", label: "Failed Quests", type: "number" },
    { key: "favoriteWeaponUsed", label: "Favorite Weapon", type: "string" },
  ],
  getQuestRewardDefs: () => [
    { key: "zenny", label: "Zenny", type: "number" },
    { key: "materials", label: "Materials", type: "list" },
  ],
};

export const gameRegistry: Record<string, GameModule> = {
  [monsterHunterModule.id]: monsterHunterModule,
};

export function getGameModule(gameId: string): GameModule | undefined {
  return gameRegistry[gameId];
}
