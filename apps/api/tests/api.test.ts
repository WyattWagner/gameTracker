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

describe("Monster catalog API", () => {
  it("lists catalog monsters and creates from catalog", async () => {
    const token = await registerAndLogin("catalog@test.com");

    const catalog = await request(app)
      .get("/api/v1/catalog/monsters?gameId=monster-hunter&type=large")
      .set("Authorization", `Bearer ${token}`);

    expect(catalog.status).toBe(200);
    expect(catalog.body.total).toBeGreaterThan(40);
    expect(catalog.body.monsters[0].name).toBeDefined();

    const rathalos = catalog.body.monsters.find((m: { name: string }) => m.name === "Rathalos");
    expect(rathalos).toBeDefined();

    const created = await request(app)
      .post("/api/v1/monsters/from-catalog")
      .set("Authorization", `Bearer ${token}`)
      .send({ gameId: "monster-hunter", catalogId: rathalos.id });

    expect(created.status).toBe(201);
    expect(created.body.name).toBe("Rathalos");
    expect(created.body.notes).toContain("wyvern");

    const detail = await request(app)
      .get(`/api/v1/monsters/${created.body.id}/mh-detail`)
      .set("Authorization", `Bearer ${token}`);
    expect(detail.body.bodyParts.length).toBeGreaterThanOrEqual(6);
    expect(detail.body.weaknesses.length).toBeGreaterThanOrEqual(6);
    const exhaust = detail.body.ailments.find((a: { name: string }) => a.name === "Exhaust");
    expect(exhaust).toBeDefined();
    const headWeakness = detail.body.weaknesses.find(
      (w: { bodyPartId: string }) =>
        detail.body.bodyParts.find((p: { id: string; name: string }) => p.id === w.bodyPartId)?.name === "Head",
    );
    expect(headWeakness?.slash).toBeGreaterThan(0);

    const duplicate = await request(app)
      .post("/api/v1/monsters/from-catalog")
      .set("Authorization", `Bearer ${token}`)
      .send({ gameId: "monster-hunter", catalogId: rathalos.id });

    expect(duplicate.status).toBe(409);
  });

  it("rejects from-catalog when gameId does not match catalog monster game", async () => {
    const token = await registerAndLogin("catalog-mismatch@test.com");

    const catalog = await request(app)
      .get("/api/v1/catalog/monsters?gameId=monster-hunter&type=large")
      .set("Authorization", `Bearer ${token}`);

    const rathalos = catalog.body.monsters.find((m: { name: string }) => m.name === "Rathalos");
    expect(rathalos).toBeDefined();

    const res = await request(app)
      .post("/api/v1/monsters/from-catalog")
      .set("Authorization", `Bearer ${token}`)
      .send({ gameId: "monster-hunter-rise", catalogId: rathalos.id });

    expect(res.status).toBe(400);
    expect(res.body.code).toBe("BAD_REQUEST");
  });

  it("imports Rise catalog monster with per-part weaknesses", async () => {
    const token = await registerAndLogin("rise-catalog@test.com");

    const catalog = await request(app)
      .get("/api/v1/catalog/monsters?gameId=monster-hunter-rise&type=large")
      .set("Authorization", `Bearer ${token}`);

    const magnamalo = catalog.body.monsters.find((m: { name: string }) => m.name === "Magnamalo");
    expect(magnamalo).toBeDefined();

    const created = await request(app)
      .post("/api/v1/monsters/from-catalog")
      .set("Authorization", `Bearer ${token}`)
      .send({ gameId: "monster-hunter-rise", catalogId: magnamalo.id });

    expect(created.status).toBe(201);

    const detail = await request(app)
      .get(`/api/v1/monsters/${created.body.id}/mh-detail`)
      .set("Authorization", `Bearer ${token}`);

    expect(detail.body.bodyParts.length).toBeGreaterThanOrEqual(5);
    expect(detail.body.weaknesses.some((w: { slash: number }) => w.slash > 0)).toBe(true);
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

    expect(stats.body.totalQuestsAccepted).toBe(1);
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
