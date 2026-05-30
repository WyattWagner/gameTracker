import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.game.upsert({
    where: { id: "monster-hunter" },
    update: { name: "Monster Hunter" },
    create: { id: "monster-hunter", name: "Monster Hunter" },
  });

  const monsters = [
    { name: "Rathalos", imageUrl: "https://placehold.co/200x200/red/white?text=Rathalos" },
    { name: "Magnamalo", imageUrl: "https://placehold.co/200x200/purple/white?text=Magnamalo" },
    { name: "Tigrex", imageUrl: "https://placehold.co/200x200/orange/white?text=Tigrex" },
    { name: "Zinogre", imageUrl: "https://placehold.co/200x200/blue/white?text=Zinogre" },
  ];

  console.log("Seeded game: monster-hunter");
  console.log(
    "Monster templates (create per-user via API):",
    monsters.map((m) => m.name).join(", "),
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
