import { Router } from "express";
import {
  CreateMonsterRequestSchema,
  ListMonstersQuerySchema,
  UpdateMonsterRequestSchema,
} from "@game-tracker/shared";
import { prisma } from "../../infrastructure/prisma/client";
import { toMonsterDto } from "../mappers/dtos";
import type { AuthenticatedRequest } from "../middleware/requireAuth";
import { requireAuth } from "../middleware/requireAuth";
import { validateBody, validateQuery } from "../middleware/validate";

export const monstersRouter = Router();
monstersRouter.use(requireAuth);

monstersRouter.get("/", validateQuery(ListMonstersQuerySchema), async (req: AuthenticatedRequest, res, next) => {
  try {
    const query = (req as AuthenticatedRequest & { validatedQuery: ReturnType<typeof ListMonstersQuerySchema.parse> })
      .validatedQuery;
    const where = {
      userId: req.user!.id,
      ...(query.gameId ? { gameId: query.gameId } : {}),
      ...(query.search ? { name: { contains: query.search } } : {}),
    };

    const monsters = await prisma.monster.findMany({
      where,
      orderBy: { [query.sort]: query.order },
    });

    res.json({
      monsters: monsters.map(toMonsterDto),
      total: monsters.length,
    });
  } catch (error) {
    next(error);
  }
});

monstersRouter.post("/", validateBody(CreateMonsterRequestSchema), async (req: AuthenticatedRequest, res, next) => {
  try {
    const body = req.body;
    const monster = await prisma.monster.create({
      data: {
        gameId: body.gameId,
        userId: req.user!.id,
        name: body.name,
        imageUrl: body.imageUrl ?? null,
        notes: body.notes ?? null,
        metadata: body.metadata ?? undefined,
      },
    });
    res.status(201).json(toMonsterDto(monster));
  } catch (error) {
    next(error);
  }
});

monstersRouter.get("/:monsterId", async (req: AuthenticatedRequest, res, next) => {
  try {
    const monster = await prisma.monster.findFirst({
      where: { id: req.params.monsterId, userId: req.user!.id },
    });
    if (!monster) {
      res.status(404).json({ code: "NOT_FOUND", message: "Monster not found" });
      return;
    }
    res.json(toMonsterDto(monster));
  } catch (error) {
    next(error);
  }
});

monstersRouter.patch(
  "/:monsterId",
  validateBody(UpdateMonsterRequestSchema),
  async (req: AuthenticatedRequest, res, next) => {
    try {
      const existing = await prisma.monster.findFirst({
        where: { id: req.params.monsterId, userId: req.user!.id },
      });
      if (!existing) {
        res.status(404).json({ code: "NOT_FOUND", message: "Monster not found" });
        return;
      }

      const monster = await prisma.monster.update({
        where: { id: existing.id },
        data: {
          ...req.body,
          metadata: req.body.metadata ?? undefined,
        },
      });
      res.json(toMonsterDto(monster));
    } catch (error) {
      next(error);
    }
  },
);

monstersRouter.delete("/:monsterId", async (req: AuthenticatedRequest, res, next) => {
  try {
    const existing = await prisma.monster.findFirst({
      where: { id: req.params.monsterId, userId: req.user!.id },
    });
    if (!existing) {
      res.status(404).json({ code: "NOT_FOUND", message: "Monster not found" });
      return;
    }

    await prisma.monster.delete({ where: { id: existing.id } });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});
