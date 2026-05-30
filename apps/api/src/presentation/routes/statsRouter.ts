import { Router } from "express";
import { computeDashboardStats } from "@game-tracker/domain";
import { DashboardQuerySchema } from "@game-tracker/shared";
import { prisma } from "../../infrastructure/prisma/client";
import { toDropDto, toEncounterDto, toMonsterDto, toQuestDto } from "../mappers/dtos";
import type { AuthenticatedRequest } from "../middleware/requireAuth";
import { requireAuth } from "../middleware/requireAuth";
import { validateQuery } from "../middleware/validate";

export const statsRouter = Router();
statsRouter.use(requireAuth);

statsRouter.get("/dashboard", validateQuery(DashboardQuerySchema), async (req: AuthenticatedRequest, res, next) => {
  try {
    const query = (req as AuthenticatedRequest & { validatedQuery: ReturnType<typeof DashboardQuerySchema.parse> })
      .validatedQuery;
    const userId = req.user!.id;
    const gameFilter = query.gameId ? { gameId: query.gameId } : {};
    const dateFilter =
      query.from || query.to
        ? {
            ...(query.from ? { gte: new Date(query.from) } : {}),
            ...(query.to ? { lte: new Date(query.to) } : {}),
          }
        : undefined;

    const [monsters, quests, encounters, drops] = await Promise.all([
      prisma.monster.findMany({ where: { userId, ...gameFilter } }),
      prisma.quest.findMany({ where: { userId, ...gameFilter } }),
      prisma.encounter.findMany({
        where: {
          userId,
          ...(dateFilter ? { encounterDate: dateFilter } : {}),
          ...(query.gameId ? { quest: { gameId: query.gameId } } : {}),
        },
      }),
      prisma.drop.findMany({
        where: {
          userId,
          ...gameFilter,
          ...(dateFilter ? { dateObtained: dateFilter } : {}),
        },
      }),
    ]);

    const stats = computeDashboardStats({
      monsters: monsters.map(toMonsterDto),
      quests: quests.map((q) => toQuestDto(q, [])),
      encounters: encounters.map(toEncounterDto),
      drops: drops.map(toDropDto),
    });

    res.json(stats);
  } catch (error) {
    next(error);
  }
});
