import { z } from "zod";
/**
 * Stable error shape used by all API endpoints.
 *
 * Why this exists:
 * - Frontend needs a predictable structure to render errors consistently.
 * - Backend needs a single place to define & validate error responses.
 */
export declare const ApiErrorSchema: z.ZodObject<{
    code: z.ZodString;
    message: z.ZodString;
    details: z.ZodOptional<z.ZodUnknown>;
}, z.core.$strip>;
export type ApiError = z.infer<typeof ApiErrorSchema>;
//# sourceMappingURL=errors.d.ts.map