import cors from "cors";
import express from "express";
import path from "node:path";
import { errorHandler } from "./presentation/errorHandler";
import { authRouter } from "./presentation/routes/authRouter";
import { dropsRouter } from "./presentation/routes/dropsRouter";
import { monstersRouter } from "./presentation/routes/monstersRouter";
import { questsRouter } from "./presentation/routes/questsRouter";
import { statsRouter } from "./presentation/routes/statsRouter";

export function createApp() {
  const app = express();
  app.use(cors());
  app.use(express.json());
  app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

  app.get("/health", (_req, res) => {
    res.json({ ok: true });
  });

  const api = express.Router();
  api.use("/auth", authRouter);
  api.use("/monsters", monstersRouter);
  api.use("/quests", questsRouter);
  api.use("/drops", dropsRouter);
  api.use("/stats", statsRouter);
  app.use("/api/v1", api);

  app.use(errorHandler);
  return app;
}
