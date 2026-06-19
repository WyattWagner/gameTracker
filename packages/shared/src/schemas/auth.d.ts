import { z } from "zod";
/**
 * Auth contracts are shared so that:
 * - the API validates inputs consistently
 * - the web app can type its forms and responses from the same source
 */
export declare const RegisterRequestSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
}, z.core.$strip>;
export type RegisterRequest = z.infer<typeof RegisterRequestSchema>;
export declare const LoginRequestSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
}, z.core.$strip>;
export type LoginRequest = z.infer<typeof LoginRequestSchema>;
export declare const AuthTokenResponseSchema: z.ZodObject<{
    accessToken: z.ZodString;
}, z.core.$strip>;
export type AuthTokenResponse = z.infer<typeof AuthTokenResponseSchema>;
export declare const MeResponseSchema: z.ZodObject<{
    id: z.ZodString;
    email: z.ZodString;
}, z.core.$strip>;
export type MeResponse = z.infer<typeof MeResponseSchema>;
//# sourceMappingURL=auth.d.ts.map