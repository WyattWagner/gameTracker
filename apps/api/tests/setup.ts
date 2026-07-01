import { PrismaClient } from "@prisma/client";
import { execSync } from "node:child_process";
import path from "node:path";
import { seedMonsterDatabase } from "../src/application/catalog/seedMonsterDatabase";
import { ensureGames } from "../src/infrastructure/db/ensureGames";

const prisma = new PrismaClient();

jest.setTimeout(120_000);

beforeAll(async () => {
  process.env.DATABASE_URL = process.env.DATABASE_URL ?? "file:./test.db";
  process.env.JWT_SECRET = "test-secret";
  execSync("npx prisma migrate deploy", {
    cwd: path.join(__dirname, ".."),
    env: process.env,
    stdio: "ignore",
  });
  await prisma.monsterImage.deleteMany();
  await prisma.monsterDbMaterial.deleteMany();
  await prisma.monsterRiseData.deleteMany();
  await prisma.monsterWildsData.deleteMany();
  await prisma.gameMonster.deleteMany();
  await seedMonsterDatabase(prisma);
});
beforeEach(async () => {
  await prisma.encounter.deleteMany();
  await prisma.drop.deleteMany();
  await prisma.materialBodyPartDrop.deleteMany();
  await prisma.monsterMaterial.deleteMany();
  await prisma.monsterAilment.deleteMany();
  await prisma.weaknessEntry.deleteMany();
  await prisma.monsterBodyPart.deleteMany();
  await prisma.questMonster.deleteMany();
  await prisma.quest.deleteMany();
  await prisma.monster.deleteMany();
  await prisma.user.deleteMany();
  await ensureGames();
});

afterAll(async () => {
  await prisma.$disconnect();
});

export { prisma };
