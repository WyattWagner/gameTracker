"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MeResponseSchema = exports.AuthTokenResponseSchema = exports.LoginRequestSchema = exports.RegisterRequestSchema = void 0;
const zod_1 = require("zod");
/**
 * Auth contracts are shared so that:
 * - the API validates inputs consistently
 * - the web app can type its forms and responses from the same source
 */
exports.RegisterRequestSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(8),
});
exports.LoginRequestSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(1),
});
exports.AuthTokenResponseSchema = zod_1.z.object({
    accessToken: zod_1.z.string(),
});
exports.MeResponseSchema = zod_1.z.object({
    id: zod_1.z.string(),
    email: zod_1.z.string().email(),
});
//# sourceMappingURL=auth.js.map