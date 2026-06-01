import request from "supertest";
import { createApp } from "../src/app";

const app = createApp();

async function registerAndLogin(email = `mh-${Date.now()}@test.com`) {
  await request(app).post("/api/v1/auth/register").send({ email, password: "password123" });
  const login = await request(app).post("/api/v1/auth/login").send({ email, password: "password123" });
  return login.body.accessToken as string;
}

describe("Monster Hunter expansion API", () => {
  it("seeds MH data on monster create and supports hunted/captured actions", async () => {
    const token = await registerAndLogin();

    const created = await request(app)
      .post("/api/v1/monsters")
      .set("Authorization", `Bearer ${token}`)
      .send({ gameId: "monster-hunter", name: "Rathian" });

    expect(created.body.canBeCaptured).toBe(true);

    const detail = await request(app)
      .get(`/api/v1/monsters/${created.body.id}/mh-detail`)
      .set("Authorization", `Bearer ${token}`);

    expect(detail.body.bodyParts.length).toBeGreaterThan(0);
    expect(detail.body.ailments.length).toBe(10);

    const hunted = await request(app)
      .post(`/api/v1/monsters/${created.body.id}/actions/hunted`)
      .set("Authorization", `Bearer ${token}`);
    expect(hunted.body.numberOfHunts).toBe(1);
    expect(hunted.body.wins).toBe(1);

    const captured = await request(app)
      .post(`/api/v1/monsters/${created.body.id}/actions/captured`)
      .set("Authorization", `Bearer ${token}`);
    expect(captured.body.captures).toBe(1);
  });

  it("rejects capture when canBeCaptured is false", async () => {
    const token = await registerAndLogin();

    const created = await request(app)
      .post("/api/v1/monsters")
      .set("Authorization", `Bearer ${token}`)
      .send({ gameId: "monster-hunter", name: "Fatalis" });

    await request(app)
      .patch(`/api/v1/monsters/${created.body.id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ canBeCaptured: false });

    const res = await request(app)
      .post(`/api/v1/monsters/${created.body.id}/actions/captured`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(403);
  });

  it("patches stats with deltas floored at zero", async () => {
    const token = await registerAndLogin();

    const created = await request(app)
      .post("/api/v1/monsters")
      .set("Authorization", `Bearer ${token}`)
      .send({ gameId: "monster-hunter", name: "Diablos" });

    await request(app)
      .patch(`/api/v1/monsters/${created.body.id}/stats`)
      .set("Authorization", `Bearer ${token}`)
      .send({ numberOfHunts: 5 });

    const decremented = await request(app)
      .patch(`/api/v1/monsters/${created.body.id}/stats`)
      .set("Authorization", `Bearer ${token}`)
      .send({ deltas: { numberOfHunts: -10 } });

    expect(decremented.body.numberOfHunts).toBe(0);
  });

  it("updates weakness cells and initializes material ranks", async () => {
    const token = await registerAndLogin();

    const created = await request(app)
      .post("/api/v1/monsters")
      .set("Authorization", `Bearer ${token}`)
      .send({ gameId: "monster-hunter", name: "Zinogre" });

    const detail = await request(app)
      .get(`/api/v1/monsters/${created.body.id}/mh-detail`)
      .set("Authorization", `Bearer ${token}`);

    const bodyPartId = detail.body.bodyParts[0].id;
    const weakness = detail.body.weaknesses.find((w: { bodyPartId: string }) => w.bodyPartId === bodyPartId);

    const patched = await request(app)
      .patch(`/api/v1/monsters/${created.body.id}/weaknesses`)
      .set("Authorization", `Bearer ${token}`)
      .send({ bodyPartId, fire: 25 });

    expect(patched.body.fire).toBe(25);

    await request(app)
      .post(`/api/v1/monsters/${created.body.id}/materials`)
      .set("Authorization", `Bearer ${token}`)
      .send({ rank: "LOW", name: "Scale", targetReward: 45 });

    const hr = await request(app)
      .post(`/api/v1/monsters/${created.body.id}/materials/initialize-rank`)
      .set("Authorization", `Bearer ${token}`)
      .send({ from: "LOW", to: "HIGH" });

    expect(hr.status).toBe(201);
    expect(hr.body.materials[0].name).toBe("Scale+");
  });
});
