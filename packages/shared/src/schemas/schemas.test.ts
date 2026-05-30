import { describe, expect, it } from "vitest";
import { RegisterRequestSchema } from "./auth";
import { RARITY_RANK } from "./common";
import { CreateMonsterRequestSchema } from "./monsters";

/**
 * Schema tests guard API contracts at the edges.
 * Edge cases: invalid email, short password, empty monster name.
 */
describe("RegisterRequestSchema", () => {
  it("accepts valid registration input", () => {
    const result = RegisterRequestSchema.safeParse({
      email: "hunter@example.com",
      password: "password123",
    });
    expect(result.success).toBe(true);
  });

  it("rejects invalid email", () => {
    const result = RegisterRequestSchema.safeParse({
      email: "not-an-email",
      password: "password123",
    });
    expect(result.success).toBe(false);
  });

  it("rejects short passwords", () => {
    const result = RegisterRequestSchema.safeParse({
      email: "hunter@example.com",
      password: "short",
    });
    expect(result.success).toBe(false);
  });
});

describe("CreateMonsterRequestSchema", () => {
  it("requires gameId and name", () => {
    expect(CreateMonsterRequestSchema.safeParse({ gameId: "", name: "Rathalos" }).success).toBe(false);
    expect(CreateMonsterRequestSchema.safeParse({ gameId: "monster-hunter", name: "" }).success).toBe(false);
  });
});

describe("RARITY_RANK", () => {
  it("orders legendary as rarest", () => {
    expect(RARITY_RANK.LEGENDARY).toBeLessThan(RARITY_RANK.COMMON);
  });
});
