const DEV_JWT_SECRET = "dev-secret-change-me";

export interface AppEnv {
  nodeEnv: string;
  port: number;
  jwtSecret: string;
  databaseUrl: string;
  corsOrigin: string | undefined;
  corsAllowVercelPreviews: boolean;
  webDistPath: string | undefined;
  uploadDir: string;
}

export function getEnv(): AppEnv {
  const nodeEnv = process.env.NODE_ENV ?? "development";
  const jwtSecret = process.env.JWT_SECRET ?? DEV_JWT_SECRET;
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error("DATABASE_URL is required");
  }

  if (nodeEnv === "production") {
    if (!process.env.JWT_SECRET || jwtSecret === DEV_JWT_SECRET) {
      throw new Error("Set a strong JWT_SECRET in production");
    }
  }

  return {
    nodeEnv,
    port: Number(process.env.PORT ?? 3001),
    jwtSecret,
    databaseUrl,
    corsOrigin: process.env.CORS_ORIGIN,
    corsAllowVercelPreviews: process.env.CORS_ALLOW_VERCEL_PREVIEWS === "true",
    webDistPath: process.env.WEB_DIST_PATH,
    uploadDir: process.env.UPLOAD_DIR ?? "uploads",
  };
}
