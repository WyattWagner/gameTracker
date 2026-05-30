import { PrismaClient } from "@prisma/client";
import { execSync } from "node:child_process";
import path from "node:path";

const prisma = new PrismaClient();

beforeAll(async () => {
  process.env.DATABASE_URL = process.env.DATABASE_URL ?? "file:./test.db";
  process.env.JWT_SECRET = "test-secret";
  execSync("npx prisma migrate deploy", {
    cwd: path.join(__dirname, ".."),
    env: process.env,
    stdio: "ignore",
  });
});

beforeEach(async () => {
  await prisma.encounter.deleteMany();
  await prisma.drop.deleteMany();
  await prisma.questMonster.deleteMany();
  await prisma.quest.deleteMany();
  await prisma.monster.deleteMany();
  await prisma.user.deleteMany();
  await prisma.game.upsert({
    where: { id: "monster-hunter" },
    update: {},
    create: { id: "monster-hunter", name: "Monster Hunter" },
  });
});

afterAll(async () => {
  await prisma.$disconnect();
});

export { prisma };
