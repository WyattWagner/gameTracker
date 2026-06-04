import fs from "node:fs";
import path from "node:path";
import { Router, type NextFunction, type Response } from "express";
import {
  CreateMonsterRequestSchema,
  ListMonstersQuerySchema,
  PatchMonsterStatsSchema,
  UpdateMonsterRequestSchema,
} from "@game-tracker/shared";
import { initializeMonsterHunterData } from "../../application/monster-hunter/initializeMonsterHunter";
import { applyMonsterStatsPatch } from "../../application/monster-hunter/applyMonsterStats";
import { ensureGames } from "../../infrastructure/db/ensureGames";
import { prisma } from "../../infrastructure/prisma/client";
import { toMonsterDto } from "../mappers/dtos";
import type { AuthenticatedRequest } from "../middleware/requireAuth";
import { requireAuth } from "../middleware/requireAuth";
import {
  monsterImageUploadMiddleware,
} from "../middleware/monsterImageUpload";
import { getMonsterUploadDir } from "../../infrastructure/paths/uploads";
import { validateBody, validateQuery } from "../middleware/validate";
import { monsterHunterRouter } from "./monsterHunterRouter";

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
    await ensureGames();
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
    await initializeMonsterHunterData(prisma, monster.id, body.gameId);
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
  "/:monsterId/stats",
  validateBody(PatchMonsterStatsSchema),
  async (req: AuthenticatedRequest, res, next) => {
    try {
      const existing = await prisma.monster.findFirst({
        where: { id: req.params.monsterId, userId: req.user!.id },
      });
      if (!existing) {
        res.status(404).json({ code: "NOT_FOUND", message: "Monster not found" });
        return;
      }

      const stats = applyMonsterStatsPatch(
        {
          numberOfHunts: existing.numberOfHunts,
          hunts: existing.hunts,
          wins: existing.wins,
          losses: existing.losses,
          captures: existing.captures,
          failedQuests: existing.failedQuests,
        },
        req.body,
      );

      const monster = await prisma.monster.update({
        where: { id: existing.id },
        data: stats,
      });
      res.json(toMonsterDto(monster));
    } catch (error) {
      next(error);
    }
  },
);

/** Hunt (slay): quest accepted + hunt + quests completed. */
async function huntActionHandler(req: AuthenticatedRequest, res: Response, next: NextFunction) {
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
        numberOfHunts: { increment: 1 },
        hunts: { increment: 1 },
        wins: { increment: 1 },
        lastEncounterAt: new Date(),
      },
    });
    res.json(toMonsterDto(monster));
  } catch (error) {
    next(error);
  }
}

monstersRouter.post("/:monsterId/actions/hunt", huntActionHandler);
monstersRouter.post("/:monsterId/actions/hunted", huntActionHandler);

/** Capture: quest accepted + quests completed + captures (no hunt count). */
monstersRouter.post("/:monsterId/actions/captured", async (req: AuthenticatedRequest, res, next) => {
  try {
    const existing = await prisma.monster.findFirst({
      where: { id: req.params.monsterId, userId: req.user!.id },
    });
    if (!existing) {
      res.status(404).json({ code: "NOT_FOUND", message: "Monster not found" });
      return;
    }
    if (!existing.canBeCaptured) {
      res.status(403).json({ code: "FORBIDDEN", message: "This monster cannot be captured" });
      return;
    }
    const monster = await prisma.monster.update({
      where: { id: existing.id },
      data: {
        numberOfHunts: { increment: 1 },
        wins: { increment: 1 },
        captures: { increment: 1 },
        lastEncounterAt: new Date(),
      },
    });
    res.json(toMonsterDto(monster));
  } catch (error) {
    next(error);
  }
});

/** Failed quest: quest accepted + failed quests (no hunt count). */
monstersRouter.post("/:monsterId/actions/quest-failed", async (req: AuthenticatedRequest, res, next) => {
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
        numberOfHunts: { increment: 1 },
        failedQuests: { increment: 1 },
        lastEncounterAt: new Date(),
      },
    });
    res.json(toMonsterDto(monster));
  } catch (error) {
    next(error);
  }
});

monstersRouter.post(
  "/:monsterId/image",
  monsterImageUploadMiddleware(),
  async (req: AuthenticatedRequest, res, next) => {
    try {
      const existing = await prisma.monster.findFirst({
        where: { id: req.params.monsterId, userId: req.user!.id },
      });
      if (!existing) {
        res.status(404).json({ code: "NOT_FOUND", message: "Monster not found" });
        return;
      }
      if (!req.file) {
        res.status(400).json({ code: "BAD_REQUEST", message: "No image file provided" });
        return;
      }

      if (existing.imageUrl?.startsWith("/uploads/")) {
        const oldPath = path.join(process.cwd(), existing.imageUrl);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }

      const destName = `${existing.id}${path.extname(req.file.filename)}`;
      const destPath = path.join(getMonsterUploadDir(), destName);
      fs.renameSync(req.file.path, destPath);

      const imageUrl = `/uploads/monsters/${destName}`;
      const monster = await prisma.monster.update({
        where: { id: existing.id },
        data: { imageUrl },
      });
      res.json(toMonsterDto(monster));
    } catch (error) {
      next(error);
    }
  },
);

monstersRouter.delete("/:monsterId/image", async (req: AuthenticatedRequest, res, next) => {
  try {
    const existing = await prisma.monster.findFirst({
      where: { id: req.params.monsterId, userId: req.user!.id },
    });
    if (!existing) {
      res.status(404).json({ code: "NOT_FOUND", message: "Monster not found" });
      return;
    }
    if (existing.imageUrl?.startsWith("/uploads/")) {
      const filePath = path.join(process.cwd(), existing.imageUrl);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }
    const monster = await prisma.monster.update({
      where: { id: existing.id },
      data: { imageUrl: null },
    });
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

monstersRouter.use("/:monsterId", monsterHunterRouter);
