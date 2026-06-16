import { Router } from "express";
import {
  getMonsterCatalog,
  ListCatalogQuerySchema,
  MHW_CATALOG_META,
  MonsterCatalogListResponseSchema,
} from "@game-tracker/shared";
import type { AuthenticatedRequest } from "../middleware/requireAuth";
import { requireAuth } from "../middleware/requireAuth";
import { validateQuery } from "../middleware/validate";

export const catalogRouter = Router();
catalogRouter.use(requireAuth);

catalogRouter.get("/monsters", validateQuery(ListCatalogQuerySchema), (req: AuthenticatedRequest, res) => {
  const query = (req as AuthenticatedRequest & { validatedQuery: ReturnType<typeof ListCatalogQuerySchema.parse> })
    .validatedQuery;

  let entries = getMonsterCatalog(query.gameId);
  if (query.type !== "all") {
    entries = entries.filter((entry) => entry.type === query.type);
  }
  if (query.search) {
    const term = query.search.toLowerCase();
    entries = entries.filter(
      (entry) =>
        entry.name.toLowerCase().includes(term) ||
        (entry.species?.toLowerCase().includes(term) ?? false),
    );
  }

  const meta = query.gameId === "monster-hunter" ? MHW_CATALOG_META : null;
  const response = MonsterCatalogListResponseSchema.parse({
    monsters: entries,
    total: entries.length,
    gameTitle: meta?.gameTitle ?? query.gameId,
    source: meta?.source ?? "unknown",
    sourceUrl: meta?.sourceUrl ?? "https://example.com",
  });

  res.json(response);
});
