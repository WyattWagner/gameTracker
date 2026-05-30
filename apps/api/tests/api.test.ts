import request from "supertest";
import { createApp } from "../src/app";

const app = createApp();

async function registerAndLogin(email = "hunter@test.com", password = "password123") {
  await request(app).post("/api/v1/auth/register").send({ email, password });
  const login = await request(app).post("/api/v1/auth/login").send({ email, password });
  return login.body.accessToken as string;
}

describe("Auth API", () => {
  it("registers a user and returns access token", async () => {
    const res = await request(app)
      .post("/api/v1/auth/register")
      .send({ email: "new@test.com", password: "password123" });

    expect(res.status).toBe(201);
    expect(res.body.accessToken).toEqual(expect.any(String));
  });

  it("rejects duplicate registration", async () => {
    await request(app).post("/api/v1/auth/register").send({ email: "dup@test.com", password: "password123" });
    const res = await request(app)
      .post("/api/v1/auth/register")
      .send({ email: "dup@test.com", password: "password123" });

    expect(res.status).toBe(409);
  });

  it("logs in with valid credentials", async () => {
    await request(app).post("/api/v1/auth/register").send({ email: "login@test.com", password: "password123" });
    const res = await request(app).post("/api/v1/auth/login").send({ email: "login@test.com", password: "password123" });
    expect(res.status).toBe(200);
    expect(res.body.accessToken).toBeDefined();
  });

  it("returns current user from /me when authenticated", async () => {
    const token = await registerAndLogin("me@test.com");
    const res = await request(app).get("/api/v1/auth/me").set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.email).toBe("me@test.com");
  });

  it("requires auth for /me", async () => {
    const res = await request(app).get("/api/v1/auth/me");
    expect(res.status).toBe(401);
  });
});

describe("Monsters API", () => {
  it("creates, lists, updates, and deletes monsters", async () => {
    const token = await registerAndLogin();

    const created = await request(app)
      .post("/api/v1/monsters")
      .set("Authorization", `Bearer ${token}`)
      .send({ gameId: "monster-hunter", name: "Rathalos" });

    expect(created.status).toBe(201);
    expect(created.body.name).toBe("Rathalos");

    const list = await request(app)
      .get("/api/v1/monsters?gameId=monster-hunter&search=Rath")
      .set("Authorization", `Bearer ${token}`);
    expect(list.body.total).toBe(1);

    const updated = await request(app)
      .patch(`/api/v1/monsters/${created.body.id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ notes: "Fire wyvern" });
    expect(updated.body.notes).toBe("Fire wyvern");

    const deleted = await request(app)
      .delete(`/api/v1/monsters/${created.body.id}`)
      .set("Authorization", `Bearer ${token}`);
    expect(deleted.status).toBe(204);
  });

  it("requires auth", async () => {
    const res = await request(app).get("/api/v1/monsters");
    expect(res.status).toBe(401);
  });
});

describe("Quests and encounters API", () => {
  it("records encounters and updates dashboard stats", async () => {
    const token = await registerAndLogin("quest@test.com");

    const monster = await request(app)
      .post("/api/v1/monsters")
      .set("Authorization", `Bearer ${token}`)
      .send({ gameId: "monster-hunter", name: "Magnamalo" });

    const quest = await request(app)
      .post("/api/v1/quests")
      .set("Authorization", `Bearer ${token}`)
      .send({
        gameId: "monster-hunter",
        name: "Smoke Out the Beast",
        completionStatus: "COMPLETED",
        monsterIds: [monster.body.id],
      });

    const encounter = await request(app)
      .post("/api/v1/quests/encounters")
      .set("Authorization", `Bearer ${token}`)
      .send({ questId: quest.body.id, monsterId: monster.body.id, result: "WIN" });

    expect(encounter.status).toBe(201);

    const stats = await request(app)
      .get("/api/v1/stats/dashboard?gameId=monster-hunter")
      .set("Authorization", `Bearer ${token}`);

    expect(stats.body.totalHunts).toBe(1);
    expect(stats.body.monstersDefeated).toBe(1);
    expect(stats.body.totalQuestsCompleted).toBe(1);
  });
});

describe("Drops API", () => {
  it("creates drops and returns aggregation", async () => {
    const token = await registerAndLogin("drop@test.com");
    const monster = await request(app)
      .post("/api/v1/monsters")
      .set("Authorization", `Bearer ${token}`)
      .send({ gameId: "monster-hunter", name: "Tigrex" });

    await request(app)
      .post("/api/v1/drops")
      .set("Authorization", `Bearer ${token}`)
      .send({
        gameId: "monster-hunter",
        sourceMonsterId: monster.body.id,
        dropName: "Tigrex Scale",
        rarity: "RARE",
        quantity: 2,
      });

    const agg = await request(app)
      .get("/api/v1/drops/aggregation?gameId=monster-hunter")
      .set("Authorization", `Bearer ${token}`);

    expect(agg.body.totalMaterialsCollected).toBe(2);
    expect(agg.body.mostFrequentMaterials[0].dropName).toBe("Tigrex Scale");
  });
});
