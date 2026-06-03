import type { RequestHandler } from "express";
import fs from "node:fs";
import path from "node:path";

export const MONSTER_UPLOAD_DIR = path.join(process.cwd(), "uploads", "monsters");
fs.mkdirSync(MONSTER_UPLOAD_DIR, { recursive: true });

/** Loads multer on demand so the API can start even if dependencies were not installed yet. */
export function monsterImageUploadMiddleware(): RequestHandler {
  return (req, res, next) => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const multer = require("multer") as typeof import("multer");
      const upload = multer({
        storage: multer.diskStorage({
          destination: MONSTER_UPLOAD_DIR,
          filename: (_req, file, cb) => {
            const ext = path.extname(file.originalname) || ".jpg";
            cb(null, `${Date.now()}${ext}`);
          },
        }),
        limits: { fileSize: 5 * 1024 * 1024 },
        fileFilter: (_req, file, cb) => {
          cb(null, ["image/jpeg", "image/png", "image/webp"].includes(file.mimetype));
        },
      });
      upload.single("image")(req, res, next);
    } catch {
      res.status(503).json({
        code: "SERVICE_UNAVAILABLE",
        message: "Image upload unavailable. From the project root run: npm install",
      });
    }
  };
}
