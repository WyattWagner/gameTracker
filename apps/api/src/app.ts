import cors from "cors";
import express from "express";
import fs from "node:fs";
import path from "node:path";
import type { AppEnv } from "./config/env";
import { getEnv } from "./config/env";
import { getUploadRoot } from "./infrastructure/paths/uploads";
import { errorHandler } from "./presentation/errorHandler";
import { authRouter } from "./presentation/routes/authRouter";
import { dropsRouter } from "./presentation/routes/dropsRouter";
import { monstersRouter } from "./presentation/routes/monstersRouter";
import { questsRouter } from "./presentation/routes/questsRouter";
import { statsRouter } from "./presentation/routes/statsRouter";

export function createApp(env: AppEnv = getEnv()) {
  const app = express();

  if (env.nodeEnv === "production") {
    app.set("trust proxy", 1);
  }

  if (env.corsOrigin) {
    const origins = env.corsOrigin.split(",").map((value) => value.trim());
    app.use(cors({ origin: origins }));
  } else if (env.nodeEnv !== "production") {
    app.use(cors());
  }

  app.use(express.json());
  app.use("/uploads", express.static(getUploadRoot()));

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

  if (env.webDistPath) {
    const webDist = path.resolve(env.webDistPath);
    if (fs.existsSync(webDist)) {
      app.use(express.static(webDist));
      app.get("*", (req, res, next) => {
        if (req.path.startsWith("/api") || req.path.startsWith("/uploads") || req.path === "/health") {
          next();
          return;
        }
        res.sendFile(path.join(webDist, "index.html"), (err) => {
          if (err) next(err);
        });
      });
    }
  }

  app.use(errorHandler);
  return app;
}
