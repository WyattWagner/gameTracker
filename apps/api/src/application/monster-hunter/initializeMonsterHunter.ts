import { DEFAULT_MH_AILMENTS, DEFAULT_MH_BODY_PARTS, ZERO_AILMENT_BARS } from "@game-tracker/shared";
import type { PrismaClient } from "@prisma/client";

const MH_GAME_IDS = new Set(["monster-hunter", "monster-hunter-rise", "monster-hunter-wilds"]);

/** Seeds default body parts, weakness rows, and ailments for a new MH monster. */
export async function initializeMonsterHunterData(prisma: PrismaClient, monsterId: string, gameId: string) {
  if (!MH_GAME_IDS.has(gameId)) return;

  await prisma.$transaction(async (tx) => {
    for (let i = 0; i < DEFAULT_MH_BODY_PARTS.length; i++) {
      const name = DEFAULT_MH_BODY_PARTS[i]!;
      const bodyPart = await tx.monsterBodyPart.create({
        data: { monsterId, name, sortOrder: i },
      });
      await tx.weaknessEntry.create({
        data: { monsterId, bodyPartId: bodyPart.id },
      });
    }

    for (let i = 0; i < DEFAULT_MH_AILMENTS.length; i++) {
      const name = DEFAULT_MH_AILMENTS[i]!;
      await tx.monsterAilment.create({
        data: { monsterId, name, isCustom: false, sortOrder: i, ...ZERO_AILMENT_BARS },
      });
    }
  });
}
