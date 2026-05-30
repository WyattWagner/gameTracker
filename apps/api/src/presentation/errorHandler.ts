import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { Prisma } from "@prisma/client";

/** Centralized error mapping keeps API responses predictable for the frontend. */
export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction): void {
  if (err instanceof ZodError) {
    res.status(400).json({
      code: "VALIDATION_ERROR",
      message: "Validation failed",
      details: err.flatten(),
    });
    return;
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2025") {
    res.status(404).json({ code: "NOT_FOUND", message: "Resource not found" });
    return;
  }

  if (err instanceof Error && err.message === "UNAUTHORIZED") {
    res.status(401).json({ code: "UNAUTHORIZED", message: "Unauthorized" });
    return;
  }

  console.error(err);
  res.status(500).json({ code: "INTERNAL_ERROR", message: "Unexpected server error" });
}
