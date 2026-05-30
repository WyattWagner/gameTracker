import { Router } from "express";
import {
  CreateEncounterRequestSchema,
  CreateQuestRequestSchema,
  ENCOUNTER_RESULT_TO_MONSTER_FIELD,
  ListQuestsQuerySchema,
  UpdateQuestRequestSchema,
} from "@game-tracker/shared";
import { prisma } from "../../infrastructure/prisma/client";
import { toEncounterDto, toQuestDto } from "../mappers/dtos";
import type { AuthenticatedRequest } from "../middleware/requireAuth";
import { requireAuth } from "../middleware/requireAuth";
import { validateBody, validateQuery } from "../middleware/validate";

export const questsRouter = Router();
questsRouter.use(requireAuth);

questsRouter.get("/", validateQuery(ListQuestsQuerySchema), async (req: AuthenticatedRequest, res, next) => {
  try {
    const query = (req as AuthenticatedRequest & { validatedQuery: ReturnType<typeof ListQuestsQuerySchema.parse> })
      .validatedQuery;
    const quests = await prisma.quest.findMany({
      where: {
        userId: req.user!.id,
        ...(query.gameId ? { gameId: query.gameId } : {}),
        ...(query.search ? { name: { contains: query.search } } : {}),
        ...(query.completionStatus ? { completionStatus: query.completionStatus } : {}),
      },
      include: { questMonsters: true },
      orderBy: { [query.sort]: query.order },
    });

    res.json({
      quests: quests.map((q) => toQuestDto(q, q.questMonsters.map((qm) => qm.monsterId))),
      total: quests.length,
    });
  } catch (error) {
    next(error);
  }
});

questsRouter.post("/", validateBody(CreateQuestRequestSchema), async (req: AuthenticatedRequest, res, next) => {
  try {
    const body = req.body;
    const quest = await prisma.quest.create({
      data: {
        gameId: body.gameId,
        userId: req.user!.id,
        name: body.name,
        completionStatus: body.completionStatus,
        timeTakenSeconds: body.timeTakenSeconds ?? null,
        cartCount: body.cartCount,
        rewards: body.rewards ?? null,
        notes: body.notes ?? null,
        weaponUsed: body.weaponUsed ?? null,
        isMultiplayer: body.isMultiplayer,
        metadata: body.metadata ?? undefined,
        questMonsters: {
          create: body.monsterIds.map((monsterId: string) => ({ monsterId })),
        },
      },
      include: { questMonsters: true },
    });
    res.status(201).json(toQuestDto(quest, quest.questMonsters.map((qm) => qm.monsterId)));
  } catch (error) {
    next(error);
  }
});

questsRouter.get("/:questId", async (req: AuthenticatedRequest, res, next) => {
  try {
    const quest = await prisma.quest.findFirst({
      where: { id: req.params.questId, userId: req.user!.id },
      include: { questMonsters: true },
    });
    if (!quest) {
      res.status(404).json({ code: "NOT_FOUND", message: "Quest not found" });
      return;
    }
    res.json(toQuestDto(quest, quest.questMonsters.map((qm) => qm.monsterId)));
  } catch (error) {
    next(error);
  }
});

questsRouter.patch(
  "/:questId",
  validateBody(UpdateQuestRequestSchema),
  async (req: AuthenticatedRequest, res, next) => {
    try {
      const existing = await prisma.quest.findFirst({
        where: { id: req.params.questId, userId: req.user!.id },
      });
      if (!existing) {
        res.status(404).json({ code: "NOT_FOUND", message: "Quest not found" });
        return;
      }

      const { monsterIds, ...updates } = req.body;
      const quest = await prisma.quest.update({
        where: { id: existing.id },
        data: {
          ...updates,
          metadata: updates.metadata ?? undefined,
          ...(monsterIds
            ? {
                questMonsters: {
                  deleteMany: {},
                  create: monsterIds.map((monsterId: string) => ({ monsterId })),
                },
              }
            : {}),
        },
        include: { questMonsters: true },
      });
      res.json(toQuestDto(quest, quest.questMonsters.map((qm) => qm.monsterId)));
    } catch (error) {
      next(error);
    }
  },
);

questsRouter.delete("/:questId", async (req: AuthenticatedRequest, res, next) => {
  try {
    const existing = await prisma.quest.findFirst({
      where: { id: req.params.questId, userId: req.user!.id },
    });
    if (!existing) {
      res.status(404).json({ code: "NOT_FOUND", message: "Quest not found" });
      return;
    }
    await prisma.quest.delete({ where: { id: existing.id } });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

/** Records hunt outcome and updates monster counters atomically. */
questsRouter.post(
  "/encounters",
  validateBody(CreateEncounterRequestSchema),
  async (req: AuthenticatedRequest, res, next) => {
    try {
      const body = req.body;
      const quest = await prisma.quest.findFirst({
        where: { id: body.questId, userId: req.user!.id },
      });
      const monster = await prisma.monster.findFirst({
        where: { id: body.monsterId, userId: req.user!.id },
      });
      if (!quest || !monster) {
        res.status(404).json({ code: "NOT_FOUND", message: "Quest or monster not found" });
        return;
      }

      const encounterDate = body.encounterDate ? new Date(body.encounterDate) : new Date();
      const counterField = ENCOUNTER_RESULT_TO_MONSTER_FIELD[body.result as keyof typeof ENCOUNTER_RESULT_TO_MONSTER_FIELD];

      const [encounter] = await prisma.$transaction([
        prisma.encounter.create({
          data: {
            questId: body.questId,
            monsterId: body.monsterId,
            userId: req.user!.id,
            result: body.result,
            encounterDate,
            metadata: body.metadata ?? undefined,
          },
        }),
        prisma.monster.update({
          where: { id: monster.id },
          data: {
            numberOfHunts: { increment: 1 },
            [counterField]: { increment: 1 },
            lastEncounterAt: encounterDate,
          },
        }),
      ]);

      res.status(201).json(toEncounterDto(encounter));
    } catch (error) {
      next(error);
    }
  },
);
