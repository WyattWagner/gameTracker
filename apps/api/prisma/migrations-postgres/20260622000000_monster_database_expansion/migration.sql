-- CreateTable
CREATE TABLE "game_monsters" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "species" TEXT,
    "description" TEXT,
    "game" TEXT NOT NULL,
    "monsterType" TEXT,
    "threatLevel" INTEGER,
    "iconImage" TEXT,
    "largeRenderImage" TEXT,
    "familySlug" TEXT NOT NULL,
    "ecologyText" TEXT,
    "canBeCaptured" BOOLEAN NOT NULL DEFAULT true,
    "monsterSize" TEXT NOT NULL DEFAULT 'large',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "game_monsters_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "monster_rise_data" (
    "id" TEXT NOT NULL,
    "monsterId" TEXT NOT NULL,
    "elementalWeaknesses" JSONB NOT NULL,
    "ailmentWeaknesses" JSONB NOT NULL,
    "statusResistances" JSONB,
    "bodyPartWeaknesses" JSONB,
    "huntRewards" JSONB,
    "captureRewards" JSONB,
    "breakRewards" JSONB,

    CONSTRAINT "monster_rise_data_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "monster_wilds_data" (
    "id" TEXT NOT NULL,
    "monsterId" TEXT NOT NULL,
    "elementalWeaknesses" JSONB NOT NULL,
    "bodyPartWeaknesses" JSONB NOT NULL,
    "woundData" JSONB,
    "breakableParts" JSONB,
    "resistanceValues" JSONB,
    "huntRewards" JSONB,
    "wildsMechanics" JSONB,

    CONSTRAINT "monster_wilds_data_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "monster_db_materials" (
    "id" TEXT NOT NULL,
    "monsterId" TEXT NOT NULL,
    "game" TEXT NOT NULL,
    "materialName" TEXT NOT NULL,
    "rarity" TEXT NOT NULL DEFAULT 'COMMON',
    "dropSource" TEXT,
    "dropRate" INTEGER,
    "rank" TEXT NOT NULL,
    "description" TEXT,
    "icon" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "monster_db_materials_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "monster_images" (
    "id" TEXT NOT NULL,
    "monsterId" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "imageType" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "monster_images_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "game_monsters_slug_game_key" ON "game_monsters"("slug", "game");

-- CreateIndex
CREATE INDEX "game_monsters_name_idx" ON "game_monsters"("name");

-- CreateIndex
CREATE INDEX "game_monsters_game_idx" ON "game_monsters"("game");

-- CreateIndex
CREATE INDEX "game_monsters_familySlug_idx" ON "game_monsters"("familySlug");

-- CreateIndex
CREATE INDEX "game_monsters_monsterType_idx" ON "game_monsters"("monsterType");

-- CreateIndex
CREATE UNIQUE INDEX "monster_rise_data_monsterId_key" ON "monster_rise_data"("monsterId");

-- CreateIndex
CREATE UNIQUE INDEX "monster_wilds_data_monsterId_key" ON "monster_wilds_data"("monsterId");

-- CreateIndex
CREATE INDEX "monster_db_materials_monsterId_game_idx" ON "monster_db_materials"("monsterId", "game");

-- CreateIndex
CREATE INDEX "monster_db_materials_monsterId_rank_idx" ON "monster_db_materials"("monsterId", "rank");

-- CreateIndex
CREATE INDEX "monster_images_monsterId_idx" ON "monster_images"("monsterId");

-- AddForeignKey
ALTER TABLE "monster_rise_data" ADD CONSTRAINT "monster_rise_data_monsterId_fkey" FOREIGN KEY ("monsterId") REFERENCES "game_monsters"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "monster_wilds_data" ADD CONSTRAINT "monster_wilds_data_monsterId_fkey" FOREIGN KEY ("monsterId") REFERENCES "game_monsters"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "monster_db_materials" ADD CONSTRAINT "monster_db_materials_monsterId_fkey" FOREIGN KEY ("monsterId") REFERENCES "game_monsters"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "monster_images" ADD CONSTRAINT "monster_images_monsterId_fkey" FOREIGN KEY ("monsterId") REFERENCES "game_monsters"("id") ON DELETE CASCADE ON UPDATE CASCADE;
