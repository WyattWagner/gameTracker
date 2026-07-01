import { prisma } from "../prisma/client";

const DEFAULT_GAMES = [
  { id: "monster-hunter", name: "Monster Hunter World" },
  { id: "monster-hunter-rise", name: "Monster Hunter Rise" },
  { id: "monster-hunter-wilds", name: "Monster Hunter Wilds" },
] as const;

/** Ensures game rows exist so monster FK constraints succeed (dev.db may never have been seeded). */
export async function ensureGames(): Promise<void> {
  for (const game of DEFAULT_GAMES) {
    await prisma.game.upsert({
      where: { id: game.id },
      update: { name: game.name },
      create: { id: game.id, name: game.name },
    });
  }
}
