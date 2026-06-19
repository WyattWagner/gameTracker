import { Router } from "express";
import { cloneMaterialsForRank } from "@game-tracker/domain";
import {
  AddMaterialBodyPartDropSchema,
  CreateAilmentSchema,
  CreateBodyPartSchema,
  CreateMaterialSchema,
  InitializeRankSchema,
  MaterialRankSchema,
  PatchWeaknessSchema,
  UpdateAilmentSchema,
  UpdateBodyPartSchema,
  UpdateMaterialSchema,
  ZERO_AILMENT_BARS,
} from "@game-tracker/shared";
import { attachStarRatings, toBodyPartDto, toMaterialDto, toWeaknessDto } from "../../application/monster-hunter/mhMappers";
import { prisma } from "../../infrastructure/prisma/client";
import type { AuthenticatedRequest } from "../middleware/requireAuth";
import { requireAuth } from "../middleware/requireAuth";
import { validateBody } from "../middleware/validate";

export const monsterHunterRouter = Router({ mergeParams: true });
monsterHunterRouter.use(requireAuth);

async function getOwnedMonster(monsterId: string, userId: string) {
  return prisma.monster.findFirst({ where: { id: monsterId, userId } });
}

monsterHunterRouter.get("/mh-detail", async (req: AuthenticatedRequest, res, next) => {
  try {
    const monsterId = req.params.monsterId!;
    const monster = await getOwnedMonster(monsterId, req.user!.id);
    if (!monster) {
      res.status(404).json({ code: "NOT_FOUND", message: "Monster not found" });
      return;
    }

    const [bodyParts, weaknesses, ailments, materials] = await Promise.all([
      prisma.monsterBodyPart.findMany({ where: { monsterId }, orderBy: { sortOrder: "asc" } }),
      prisma.weaknessEntry.findMany({ where: { monsterId } }),
      prisma.monsterAilment.findMany({ where: { monsterId }, orderBy: { sortOrder: "asc" } }),
      prisma.monsterMaterial.findMany({
        where: { monsterId },
        include: { bodyPartDrops: true },
        orderBy: [{ rank: "asc" }, { sortOrder: "asc" }],
      }),
    ]);

    res.json({
      bodyParts: bodyParts.map(toBodyPartDto),
      weaknesses: weaknesses.map(toWeaknessDto),
      ailments: attachStarRatings(ailments),
      materials: materials.map((m) =>
        toMaterialDto(
          m,
          m.bodyPartDrops.map((d) => ({
            id: d.id,
            materialId: d.materialId,
            bodyPartId: d.bodyPartId,
            chance: d.chance,
          })),
        ),
      ),
    });
  } catch (error) {
    next(error);
  }
});

monsterHunterRouter.get("/body-parts", async (req: AuthenticatedRequest, res, next) => {
  try {
    const monsterId = req.params.monsterId!;
    const monster = await getOwnedMonster(monsterId, req.user!.id);
    if (!monster) {
      res.status(404).json({ code: "NOT_FOUND", message: "Monster not found" });
      return;
    }
    const parts = await prisma.monsterBodyPart.findMany({ where: { monsterId }, orderBy: { sortOrder: "asc" } });
    res.json({ bodyParts: parts.map(toBodyPartDto) });
  } catch (error) {
    next(error);
  }
});

monsterHunterRouter.post("/body-parts", validateBody(CreateBodyPartSchema), async (req: AuthenticatedRequest, res, next) => {
  try {
    const monsterId = req.params.monsterId!;
    const monster = await getOwnedMonster(monsterId, req.user!.id);
    if (!monster) {
      res.status(404).json({ code: "NOT_FOUND", message: "Monster not found" });
      return;
    }
    const count = await prisma.monsterBodyPart.count({ where: { monsterId } });
    const bodyPart = await prisma.monsterBodyPart.create({
      data: { monsterId, name: req.body.name, sortOrder: req.body.sortOrder ?? count },
    });
    await prisma.weaknessEntry.create({ data: { monsterId, bodyPartId: bodyPart.id } });
    res.status(201).json(toBodyPartDto(bodyPart));
  } catch (error) {
    next(error);
  }
});

monsterHunterRouter.patch(
  "/body-parts/:bodyPartId",
  validateBody(UpdateBodyPartSchema),
  async (req: AuthenticatedRequest, res, next) => {
    try {
      const monsterId = req.params.monsterId!;
      const existing = await prisma.monsterBodyPart.findFirst({
        where: { id: req.params.bodyPartId, monsterId, monster: { userId: req.user!.id } },
      });
      if (!existing) {
        res.status(404).json({ code: "NOT_FOUND", message: "Body part not found" });
        return;
      }
      const updated = await prisma.monsterBodyPart.update({ where: { id: existing.id }, data: req.body });
      res.json(toBodyPartDto(updated));
    } catch (error) {
      next(error);
    }
  },
);

monsterHunterRouter.delete("/body-parts/:bodyPartId", async (req: AuthenticatedRequest, res, next) => {
  try {
    const monsterId = req.params.monsterId!;
    const existing = await prisma.monsterBodyPart.findFirst({
      where: { id: req.params.bodyPartId, monsterId, monster: { userId: req.user!.id } },
    });
    if (!existing) {
      res.status(404).json({ code: "NOT_FOUND", message: "Body part not found" });
      return;
    }
    await prisma.monsterBodyPart.delete({ where: { id: existing.id } });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

monsterHunterRouter.get("/weaknesses", async (req: AuthenticatedRequest, res, next) => {
  try {
    const monsterId = req.params.monsterId!;
    const monster = await getOwnedMonster(monsterId, req.user!.id);
    if (!monster) {
      res.status(404).json({ code: "NOT_FOUND", message: "Monster not found" });
      return;
    }
    const weaknesses = await prisma.weaknessEntry.findMany({ where: { monsterId } });
    res.json({ weaknesses: weaknesses.map(toWeaknessDto) });
  } catch (error) {
    next(error);
  }
});

monsterHunterRouter.patch("/weaknesses", validateBody(PatchWeaknessSchema), async (req: AuthenticatedRequest, res, next) => {
  try {
    const monsterId = req.params.monsterId!;
    const { bodyPartId, ...values } = req.body;
    const entry = await prisma.weaknessEntry.findFirst({
      where: { monsterId, bodyPartId, monster: { userId: req.user!.id } },
    });
    if (!entry) {
      res.status(404).json({ code: "NOT_FOUND", message: "Weakness entry not found" });
      return;
    }
    const updated = await prisma.weaknessEntry.update({ where: { id: entry.id }, data: values });
    res.json(toWeaknessDto(updated));
  } catch (error) {
    next(error);
  }
});

monsterHunterRouter.get("/ailments", async (req: AuthenticatedRequest, res, next) => {
  try {
    const monsterId = req.params.monsterId!;
    const monster = await getOwnedMonster(monsterId, req.user!.id);
    if (!monster) {
      res.status(404).json({ code: "NOT_FOUND", message: "Monster not found" });
      return;
    }
    const ailments = await prisma.monsterAilment.findMany({ where: { monsterId }, orderBy: { sortOrder: "asc" } });
    res.json({ ailments: attachStarRatings(ailments) });
  } catch (error) {
    next(error);
  }
});

monsterHunterRouter.post("/ailments", validateBody(CreateAilmentSchema), async (req: AuthenticatedRequest, res, next) => {
  try {
    const monsterId = req.params.monsterId!;
    const monster = await getOwnedMonster(monsterId, req.user!.id);
    if (!monster) {
      res.status(404).json({ code: "NOT_FOUND", message: "Monster not found" });
      return;
    }
    const count = await prisma.monsterAilment.count({ where: { monsterId } });
    const ailment = await prisma.monsterAilment.create({
      data: {
        monsterId,
        name: req.body.name,
        isCustom: req.body.isCustom ?? true,
        initialResistance: req.body.initialResistance ?? ZERO_AILMENT_BARS.initialResistance,
        nextResistanceThreshold: req.body.nextResistanceThreshold ?? ZERO_AILMENT_BARS.nextResistanceThreshold,
        maximumResistance: req.body.maximumResistance ?? ZERO_AILMENT_BARS.maximumResistance,
        naturalBuildUpDegradation:
          req.body.naturalBuildUpDegradation ?? ZERO_AILMENT_BARS.naturalBuildUpDegradation,
        totalEffectiveness: req.body.totalEffectiveness ?? ZERO_AILMENT_BARS.totalEffectiveness,
        sortOrder: count,
      },
    });
    const stars = attachStarRatings([ailment]);
    res.status(201).json(stars[0]);
  } catch (error) {
    next(error);
  }
});

monsterHunterRouter.patch(
  "/ailments/:ailmentId",
  validateBody(UpdateAilmentSchema),
  async (req: AuthenticatedRequest, res, next) => {
    try {
      const monsterId = req.params.monsterId!;
      const existing = await prisma.monsterAilment.findFirst({
        where: { id: req.params.ailmentId, monsterId, monster: { userId: req.user!.id } },
      });
      if (!existing) {
        res.status(404).json({ code: "NOT_FOUND", message: "Ailment not found" });
        return;
      }
      const updated = await prisma.monsterAilment.update({ where: { id: existing.id }, data: req.body });
      const stars = attachStarRatings([updated]);
      res.json(stars[0]);
    } catch (error) {
      next(error);
    }
  },
);

monsterHunterRouter.delete("/ailments/:ailmentId", async (req: AuthenticatedRequest, res, next) => {
  try {
    const monsterId = req.params.monsterId!;
    const existing = await prisma.monsterAilment.findFirst({
      where: { id: req.params.ailmentId, monsterId, monster: { userId: req.user!.id } },
    });
    if (!existing) {
      res.status(404).json({ code: "NOT_FOUND", message: "Ailment not found" });
      return;
    }
    await prisma.monsterAilment.delete({ where: { id: existing.id } });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

monsterHunterRouter.get("/materials", async (req: AuthenticatedRequest, res, next) => {
  try {
    const monsterId = req.params.monsterId!;
    const rank = req.query.rank ? MaterialRankSchema.parse(req.query.rank) : undefined;
    const monster = await getOwnedMonster(monsterId, req.user!.id);
    if (!monster) {
      res.status(404).json({ code: "NOT_FOUND", message: "Monster not found" });
      return;
    }
    const materials = await prisma.monsterMaterial.findMany({
      where: { monsterId, ...(rank ? { rank } : {}) },
      include: { bodyPartDrops: true },
      orderBy: { sortOrder: "asc" },
    });
    res.json({
      materials: materials.map((m) =>
        toMaterialDto(
          m,
          m.bodyPartDrops.map((d) => ({
            id: d.id,
            materialId: d.materialId,
            bodyPartId: d.bodyPartId,
            chance: d.chance,
          })),
        ),
      ),
    });
  } catch (error) {
    next(error);
  }
});

monsterHunterRouter.post("/materials", validateBody(CreateMaterialSchema), async (req: AuthenticatedRequest, res, next) => {
  try {
    const monsterId = req.params.monsterId!;
    const monster = await getOwnedMonster(monsterId, req.user!.id);
    if (!monster) {
      res.status(404).json({ code: "NOT_FOUND", message: "Monster not found" });
      return;
    }
    const count = await prisma.monsterMaterial.count({ where: { monsterId, rank: req.body.rank } });
    const material = await prisma.monsterMaterial.create({
      data: {
        monsterId,
        rank: req.body.rank,
        name: req.body.name,
        targetReward: req.body.targetReward ?? 0,
        captureReward: req.body.captureReward ?? 0,
        brokenPartReward: req.body.brokenPartReward ?? 0,
        carveReward: req.body.carveReward ?? 0,
        dropMaterialReward: req.body.dropMaterialReward ?? 0,
        sortOrder: count,
      },
      include: { bodyPartDrops: true },
    });
    res.status(201).json(toMaterialDto(material, []));
  } catch (error) {
    next(error);
  }
});

monsterHunterRouter.patch(
  "/materials/:materialId",
  validateBody(UpdateMaterialSchema),
  async (req: AuthenticatedRequest, res, next) => {
    try {
      const monsterId = req.params.monsterId!;
      const existing = await prisma.monsterMaterial.findFirst({
        where: { id: req.params.materialId, monsterId, monster: { userId: req.user!.id } },
        include: { bodyPartDrops: true },
      });
      if (!existing) {
        res.status(404).json({ code: "NOT_FOUND", message: "Material not found" });
        return;
      }
      const updated = await prisma.monsterMaterial.update({
        where: { id: existing.id },
        data: req.body,
        include: { bodyPartDrops: true },
      });
      res.json(
        toMaterialDto(
          updated,
          updated.bodyPartDrops.map((d) => ({
            id: d.id,
            materialId: d.materialId,
            bodyPartId: d.bodyPartId,
            chance: d.chance,
          })),
        ),
      );
    } catch (error) {
      next(error);
    }
  },
);

monsterHunterRouter.delete("/materials/:materialId", async (req: AuthenticatedRequest, res, next) => {
  try {
    const monsterId = req.params.monsterId!;
    const existing = await prisma.monsterMaterial.findFirst({
      where: { id: req.params.materialId, monsterId, monster: { userId: req.user!.id } },
    });
    if (!existing) {
      res.status(404).json({ code: "NOT_FOUND", message: "Material not found" });
      return;
    }
    await prisma.monsterMaterial.delete({ where: { id: existing.id } });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

monsterHunterRouter.post(
  "/materials/initialize-rank",
  validateBody(InitializeRankSchema),
  async (req: AuthenticatedRequest, res, next) => {
    try {
      const monsterId = req.params.monsterId!;
      const { from, to } = req.body;
      const monster = await getOwnedMonster(monsterId, req.user!.id);
      if (!monster) {
        res.status(404).json({ code: "NOT_FOUND", message: "Monster not found" });
        return;
      }

      const targetCount = await prisma.monsterMaterial.count({ where: { monsterId, rank: to } });
      if (targetCount > 0) {
        res.status(409).json({ code: "CONFLICT", message: `Rank ${to} already has materials` });
        return;
      }

      const sources = await prisma.monsterMaterial.findMany({
        where: { monsterId, rank: from },
        orderBy: { sortOrder: "asc" },
      });
      if (sources.length === 0) {
        res.status(400).json({ code: "BAD_REQUEST", message: `No materials in rank ${from}` });
        return;
      }

      const cloned = cloneMaterialsForRank(sources, from, to);
      const created = await prisma.$transaction(
        cloned.map((m, i) =>
          prisma.monsterMaterial.create({
            data: {
              monsterId,
              rank: to,
              name: m.name,
              targetReward: m.targetReward,
              captureReward: m.captureReward,
              brokenPartReward: m.brokenPartReward,
              carveReward: m.carveReward,
              dropMaterialReward: m.dropMaterialReward,
              sortOrder: i,
            },
            include: { bodyPartDrops: true },
          }),
        ),
      );

      res.status(201).json({
        materials: created.map((m) => toMaterialDto(m, [])),
      });
    } catch (error) {
      next(error);
    }
  },
);

monsterHunterRouter.post(
  "/materials/:materialId/body-part-drops",
  validateBody(AddMaterialBodyPartDropSchema),
  async (req: AuthenticatedRequest, res, next) => {
    try {
      const monsterId = req.params.monsterId!;
      const material = await prisma.monsterMaterial.findFirst({
        where: { id: req.params.materialId, monsterId, monster: { userId: req.user!.id } },
        include: { bodyPartDrops: true },
      });
      if (!material) {
        res.status(404).json({ code: "NOT_FOUND", message: "Material not found" });
        return;
      }
      const drop = await prisma.materialBodyPartDrop.upsert({
        where: {
          materialId_bodyPartId: { materialId: material.id, bodyPartId: req.body.bodyPartId },
        },
        create: {
          materialId: material.id,
          bodyPartId: req.body.bodyPartId,
          chance: req.body.chance,
        },
        update: { chance: req.body.chance },
      });
      res.status(201).json({
        id: drop.id,
        materialId: drop.materialId,
        bodyPartId: drop.bodyPartId,
        chance: drop.chance,
      });
    } catch (error) {
      next(error);
    }
  },
);

monsterHunterRouter.delete(
  "/materials/:materialId/body-part-drops/:bodyPartId",
  async (req: AuthenticatedRequest, res, next) => {
    try {
      const monsterId = req.params.monsterId!;
      const material = await prisma.monsterMaterial.findFirst({
        where: { id: req.params.materialId, monsterId, monster: { userId: req.user!.id } },
      });
      if (!material) {
        res.status(404).json({ code: "NOT_FOUND", message: "Material not found" });
        return;
      }
      await prisma.materialBodyPartDrop.deleteMany({
        where: { materialId: material.id, bodyPartId: req.params.bodyPartId },
      });
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  },
);
