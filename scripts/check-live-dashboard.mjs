const base = "http://localhost:3001/api/v1";
const email = `dash-check-${Date.now()}@test.com`;
const password = "password123";

const reg = await fetch(`${base}/auth/register`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ email, password }),
});
const { accessToken } = await reg.json();

const monster = await (
  await fetch(`${base}/monsters`, {
    method: "POST",
    headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" },
    body: JSON.stringify({ gameId: "monster-hunter", name: "CheckMonster" }),
  })
).json();

await fetch(`${base}/monsters/${monster.id}/actions/hunt`, {
  method: "POST",
  headers: { Authorization: `Bearer ${accessToken}` },
});
await fetch(`${base}/monsters/${monster.id}/actions/captured`, {
  method: "POST",
  headers: { Authorization: `Bearer ${accessToken}` },
});

const stats = await (
  await fetch(`${base}/stats/dashboard?gameId=monster-hunter`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  })
).json();

console.log("Live API dashboard:", stats);
console.log("Monster:", { numberOfHunts: monster.numberOfHunts, hunts: monster.hunts });
