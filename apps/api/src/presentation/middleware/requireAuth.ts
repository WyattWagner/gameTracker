import type { NextFunction, Request, Response } from "express";
import { verifyAccessToken } from "../../infrastructure/auth/tokens";

export interface AuthenticatedRequest extends Request {
  user?: { id: string; email: string };
}

/** Protects routes — returns 401 when Bearer token is missing or invalid. */
export function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    res.status(401).json({ code: "UNAUTHORIZED", message: "Missing bearer token" });
    return;
  }

  try {
    const token = header.slice("Bearer ".length);
    const payload = verifyAccessToken(token);
    req.user = { id: payload.sub, email: payload.email };
    next();
  } catch {
    res.status(401).json({ code: "UNAUTHORIZED", message: "Invalid or expired token" });
  }
}
