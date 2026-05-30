import { Router } from "express";
import { computeDropAggregation } from "@game-tracker/domain";
import {
  CreateDropRequestSchema,
  ListDropsQuerySchema,
  RARITY_RANK,
  UpdateDropRequestSchema,
} from "@game-tracker/shared";
import { prisma } from "../../infrastructure/prisma/client";
import { toDropDto } from "../mappers/dtos";
import type { AuthenticatedRequest } from "../middleware/requireAuth";
import { requireAuth } from "../middleware/requireAuth";
import { validateBody, validateQuery } from "../middleware/validate";

export const dropsRouter = Router();
dropsRouter.use(requireAuth);

dropsRouter.get("/", validateQuery(ListDropsQuerySchema), async (req: AuthenticatedRequest, res, next) => {
  try {
    const query = (req as AuthenticatedRequest & { validatedQuery: ReturnType<typeof ListDropsQuerySchema.parse> })
      .validatedQuery;
    const drops = await prisma.drop.findMany({
      where: {
        userId: req.user!.id,
        ...(query.gameId ? { gameId: query.gameId } : {}),
        ...(query.sourceMonsterId ? { sourceMonsterId: query.sourceMonsterId } : {}),
        ...(query.search ? { dropName: { contains: query.search } } : {}),
      },
    });

    const sorted = [...drops].sort((a, b) => {
      if (query.sort === "rarity") {
        const diff = RARITY_RANK[a.rarity as keyof typeof RARITY_RANK] - RARITY_RANK[b.rarity as keyof typeof RARITY_RANK];
        return query.order === "asc" ? diff : -diff;
      }
      const field = query.sort as keyof typeof a;
      const left = a[field];
      const right = b[field];
      if (left === right) return 0;
      if (left == null) return 1;
      if (right == null) return -1;
      return query.order === "asc" ? (left > right ? 1 : -1) : left < right ? 1 : -1;
    });

    res.json({
      drops: sorted.map(toDropDto),
      total: sorted.length,
    });
  } catch (error) {
    next(error);
  }
});

dropsRouter.get("/aggregation", async (req: AuthenticatedRequest, res, next) => {
  try {
    const gameId = typeof req.query.gameId === "string" ? req.query.gameId : undefined;
    const drops = await prisma.drop.findMany({
      where: { userId: req.user!.id, ...(gameId ? { gameId } : {}) },
    });
    res.json(computeDropAggregation(drops.map(toDropDto)));
  } catch (error) {
    next(error);
  }
});

dropsRouter.post("/", validateBody(CreateDropRequestSchema), async (req: AuthenticatedRequest, res, next) => {
  try {
    const body = req.body;
    const drop = await prisma.drop.create({
      data: {
        gameId: body.gameId,
        userId: req.user!.id,
        sourceMonsterId: body.sourceMonsterId,
        questId: body.questId ?? null,
        dropName: body.dropName,
        rarity: body.rarity,
        quantity: body.quantity,
        dateObtained: body.dateObtained ? new Date(body.dateObtained) : new Date(),
        metadata: body.metadata ?? undefined,
      },
    });
    res.status(201).json(toDropDto(drop));
  } catch (error) {
    next(error);
  }
});

dropsRouter.get("/:dropId", async (req: AuthenticatedRequest, res, next) => {
  try {
    const drop = await prisma.drop.findFirst({
      where: { id: req.params.dropId, userId: req.user!.id },
    });
    if (!drop) {
      res.status(404).json({ code: "NOT_FOUND", message: "Drop not found" });
      return;
    }
    res.json(toDropDto(drop));
  } catch (error) {
    next(error);
  }
});

dropsRouter.patch("/:dropId", validateBody(UpdateDropRequestSchema), async (req: AuthenticatedRequest, res, next) => {
  try {
    const existing = await prisma.drop.findFirst({
      where: { id: req.params.dropId, userId: req.user!.id },
    });
    if (!existing) {
      res.status(404).json({ code: "NOT_FOUND", message: "Drop not found" });
      return;
    }

    const drop = await prisma.drop.update({
      where: { id: existing.id },
      data: {
        ...req.body,
        dateObtained: req.body.dateObtained ? new Date(req.body.dateObtained) : undefined,
        metadata: req.body.metadata ?? undefined,
      },
    });
    res.json(toDropDto(drop));
  } catch (error) {
    next(error);
  }
});

dropsRouter.delete("/:dropId", async (req: AuthenticatedRequest, res, next) => {
  try {
    const existing = await prisma.drop.findFirst({
      where: { id: req.params.dropId, userId: req.user!.id },
    });
    if (!existing) {
      res.status(404).json({ code: "NOT_FOUND", message: "Drop not found" });
      return;
    }
    await prisma.drop.delete({ where: { id: existing.id } });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});
