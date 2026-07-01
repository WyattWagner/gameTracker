/** API base path or absolute URL (split hosting). */
export const API_BASE = import.meta.env.VITE_API_URL ?? "/api/v1";

/** Origin for static assets served by the API (e.g. /uploads). */
export function getApiOrigin(): string {
  const explicit = import.meta.env.VITE_API_ORIGIN?.trim();
  if (explicit) return explicit.replace(/\/$/, "");

  if (API_BASE.startsWith("http")) {
    try {
      return new URL(API_BASE).origin;
    } catch {
      return "";
    }
  }

  return "";
}

const MONSTER_PLACEHOLDER =
  "https://placehold.co/120x120/e8dcc0/6b5d4a?text=Monster";

/** Resolve relative upload paths when the web app is on a different host than the API. */
export function resolveAssetUrl(url: string | null | undefined, fallback = MONSTER_PLACEHOLDER): string {
  if (!url) return fallback;
  if (url.startsWith("http://") || url.startsWith("https://")) return url;

  const origin = getApiOrigin();
  if (url.startsWith("/") && origin) return `${origin}${url}`;
  return url;
}
