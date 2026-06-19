"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiErrorSchema = void 0;
const zod_1 = require("zod");
/**
 * Stable error shape used by all API endpoints.
 *
 * Why this exists:
 * - Frontend needs a predictable structure to render errors consistently.
 * - Backend needs a single place to define & validate error responses.
 */
exports.ApiErrorSchema = zod_1.z.object({
    code: zod_1.z.string(),
    message: zod_1.z.string(),
    details: zod_1.z.unknown().optional(),
});
//# sourceMappingURL=errors.js.map