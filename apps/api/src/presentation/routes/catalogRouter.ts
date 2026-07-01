import { Router } from "express";
import {
  CATALOG_GAME_META,
  GameMonsterDetailSchema,
  GameMonsterFamilySchema,
  GameMonsterListResponseSchema,
  ListCatalogQuerySchema,
  type CatalogGameId,
} from "@game-tracker/shared";
import {
  catalogMetaForGame,
  getFamilyBySlug,
  getGameMonsterDetail,
  listGameMonsters,
  resolveFamilySlugFromName,
} from "../../application/catalog/catalogService";
import type { AuthenticatedRequest } from "../middleware/requireAuth";
import { requireAuth } from "../middleware/requireAuth";
import { validateQuery } from "../middleware/validate";

export const catalogRouter = Router();
catalogRouter.use(requireAuth);

function parseGameId(raw: string): CatalogGameId {
  if (raw in CATALOG_GAME_META) return raw as CatalogGameId;
  return "monster-hunter";
}

catalogRouter.get("/monsters", validateQuery(ListCatalogQuerySchema), async (req: AuthenticatedRequest, res, next) => {
  try {
    const query = (req as AuthenticatedRequest & { validatedQuery: ReturnType<typeof ListCatalogQuerySchema.parse> })
      .validatedQuery;

    const gameId = parseGameId(query.gameId);
    const { monsters, total } = await listGameMonsters({
      gameId,
      search: query.search,
      type: query.type,
      monsterType: query.monsterType,
      weaknessElement: query.weaknessElement,
      rank: query.rank,
      page: query.page,
      pageSize: query.pageSize,
    });

    const meta = catalogMetaForGame(gameId);
    const response = GameMonsterListResponseSchema.parse({
      monsters,
      total,
      page: query.page,
      pageSize: query.pageSize,
      gameTitle: meta.gameTitle,
      source: meta.source,
      sourceUrl: meta.sourceUrl,
    });

    res.json(response);
  } catch (err) {
    next(err);
  }
});

catalogRouter.get("/monsters/family/:familySlug", async (req, res, next) => {
  try {
    const family = await getFamilyBySlug(req.params.familySlug);
    if (!family) {
      res.status(404).json({ code: "NOT_FOUND", message: "Monster family not found" });
      return;
    }
    res.json(GameMonsterFamilySchema.parse(family));
  } catch (err) {
    next(err);
  }
});

catalogRouter.get("/monsters/resolve-family", async (req, res, next) => {
  try {
    const name = String(req.query.name ?? "");
    if (!name.trim()) {
      res.status(400).json({ code: "VALIDATION_ERROR", message: "name query required" });
      return;
    }
    const familySlug = await resolveFamilySlugFromName(name);
    const family = await getFamilyBySlug(familySlug);
    res.json(family ?? { familySlug, name, games: [] });
  } catch (err) {
    next(err);
  }
});

catalogRouter.get("/monsters/:id", async (req, res, next) => {
  try {
    const detail = await getGameMonsterDetail(req.params.id);
    if (!detail) {
      res.status(404).json({ code: "NOT_FOUND", message: "Catalog monster not found" });
      return;
    }
    res.json(GameMonsterDetailSchema.parse(detail));
  } catch (err) {
    next(err);
  }
});
