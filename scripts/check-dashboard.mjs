import { PrismaClient } from "@prisma/client";
import { computeDashboardStats } from "@game-tracker/domain";

const prisma = new PrismaClient();
const monsters = await prisma.monster.findMany();
const sumQA = monsters.reduce((s, m) => s + m.numberOfHunts, 0);
const sumHunts = monsters.reduce((s, m) => s + m.hunts, 0);
console.log("DB monsters:", monsters.map((m) => ({ name: m.name, numberOfHunts: m.numberOfHunts, hunts: m.hunts })));
console.log("DB sums: questsAccepted=", sumQA, "hunts=", sumHunts);

const stats = computeDashboardStats({
  monsters: monsters.map((m) => ({
    ...m,
    lastEncounterAt: m.lastEncounterAt?.toISOString() ?? null,
    metadata: m.metadata ?? undefined,
  })),
  quests: [],
  encounters: [],
  drops: [],
});
console.log("Dashboard:", { totalQuestsAccepted: stats.totalQuestsAccepted, totalHunts: stats.totalHunts });
await prisma.$disconnect();
