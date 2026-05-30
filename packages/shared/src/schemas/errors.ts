import { z } from "zod";

/**
 * Stable error shape used by all API endpoints.
 *
 * Why this exists:
 * - Frontend needs a predictable structure to render errors consistently.
 * - Backend needs a single place to define & validate error responses.
 */
export const ApiErrorSchema = z.object({
  code: z.string(),
  message: z.string(),
  details: z.unknown().optional(),
});

export type ApiError = z.infer<typeof ApiErrorSchema>;

