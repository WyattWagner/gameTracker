import type { NextFunction, Request, Response } from "express";
import { verifyAccessToken } from "../../infrastructure/auth/tokens";
import { prisma } from "../../infrastructure/prisma/client";

export interface AuthenticatedRequest extends Request {
  user?: { id: string; email: string };
}

/** Protects routes — returns 401 when Bearer token is missing, invalid, or user no longer exists. */
export async function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    res.status(401).json({ code: "UNAUTHORIZED", message: "Missing bearer token" });
    return;
  }

  try {
    const token = header.slice("Bearer ".length);
    const payload = verifyAccessToken(token);
    const user = await prisma.user.findUnique({ where: { id: payload.sub } });
    if (!user) {
      res.status(401).json({ code: "UNAUTHORIZED", message: "Session expired. Please sign in again." });
      return;
    }
    req.user = { id: user.id, email: user.email };
    next();
  } catch {
    res.status(401).json({ code: "UNAUTHORIZED", message: "Invalid or expired token" });
  }
}
