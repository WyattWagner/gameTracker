import { PrismaClient } from "@prisma/client";
import { seedMonsterDatabase } from "../src/application/catalog/seedMonsterDatabase";

const prisma = new PrismaClient();

async function main() {
  await prisma.game.upsert({
    where: { id: "monster-hunter" },
    update: { name: "Monster Hunter" },
    create: { id: "monster-hunter", name: "Monster Hunter" },
  });

  await seedMonsterDatabase(prisma);

  console.log("Seeded game: monster-hunter");
  console.log("Monster database populated (World, Rise, Sunbreak, Wilds)");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
