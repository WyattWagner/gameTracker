import { z } from "zod";

/**
 * Auth contracts are shared so that:
 * - the API validates inputs consistently
 * - the web app can type its forms and responses from the same source
 */

export const RegisterRequestSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});
export type RegisterRequest = z.infer<typeof RegisterRequestSchema>;

export const LoginRequestSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});
export type LoginRequest = z.infer<typeof LoginRequestSchema>;

export const AuthTokenResponseSchema = z.object({
  accessToken: z.string(),
});
export type AuthTokenResponse = z.infer<typeof AuthTokenResponseSchema>;

export const MeResponseSchema = z.object({
  id: z.string(),
  email: z.string().email(),
});
export type MeResponse = z.infer<typeof MeResponseSchema>;

