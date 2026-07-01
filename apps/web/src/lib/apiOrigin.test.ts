import { describe, expect, it } from "vitest";
import { getApiOrigin, resolveAssetUrl } from "./apiOrigin";

describe("apiOrigin", () => {
  it("resolves relative upload paths when API origin is set", () => {
    expect(resolveAssetUrl("/uploads/monsters/foo.jpg", "fallback")).toBe("/uploads/monsters/foo.jpg");
  });

  it("returns absolute URLs unchanged", () => {
    expect(resolveAssetUrl("https://cdn.example.com/a.png")).toBe("https://cdn.example.com/a.png");
  });

  it("returns fallback for empty input", () => {
    expect(resolveAssetUrl(null, "fallback")).toBe("fallback");
  });

  it("getApiOrigin returns empty string for same-origin dev default", () => {
    expect(getApiOrigin()).toBe("");
  });
});
