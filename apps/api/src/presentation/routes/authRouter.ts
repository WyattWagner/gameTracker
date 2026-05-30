import { Router } from "express";
import { LoginRequestSchema, MeResponseSchema, RegisterRequestSchema } from "@game-tracker/shared";
import { hashPassword, signAccessToken, verifyPassword } from "../../infrastructure/auth/tokens";
import { prisma } from "../../infrastructure/prisma/client";
import type { AuthenticatedRequest } from "../middleware/requireAuth";
import { requireAuth } from "../middleware/requireAuth";
import { validateBody } from "../middleware/validate";

export const authRouter = Router();

authRouter.post("/register", validateBody(RegisterRequestSchema), async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      res.status(409).json({ code: "CONFLICT", message: "Email already registered" });
      return;
    }

    const user = await prisma.user.create({
      data: { email, passwordHash: await hashPassword(password) },
    });

    const accessToken = signAccessToken(user.id, user.email);
    res.status(201).json({ accessToken });
  } catch (error) {
    next(error);
  }
});

authRouter.post("/login", validateBody(LoginRequestSchema), async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !(await verifyPassword(password, user.passwordHash))) {
      res.status(401).json({ code: "UNAUTHORIZED", message: "Invalid credentials" });
      return;
    }

    res.json({ accessToken: signAccessToken(user.id, user.email) });
  } catch (error) {
    next(error);
  }
});

authRouter.get("/me", requireAuth, async (req: AuthenticatedRequest, res, next) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user!.id } });
    if (!user) {
      res.status(404).json({ code: "NOT_FOUND", message: "User not found" });
      return;
    }

    const payload = MeResponseSchema.parse({ id: user.id, email: user.email });
    res.json(payload);
  } catch (error) {
    next(error);
  }
});
