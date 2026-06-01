-- AlterTable
ALTER TABLE "Monster" ADD COLUMN "canBeCaptured" BOOLEAN NOT NULL DEFAULT true;

-- CreateTable
CREATE TABLE "MonsterBodyPart" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "monsterId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "MonsterBodyPart_monsterId_fkey" FOREIGN KEY ("monsterId") REFERENCES "Monster" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "WeaknessEntry" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "monsterId" TEXT NOT NULL,
    "bodyPartId" TEXT NOT NULL,
    "slash" INTEGER NOT NULL DEFAULT 0,
    "blunt" INTEGER NOT NULL DEFAULT 0,
    "pierce" INTEGER NOT NULL DEFAULT 0,
    "fire" INTEGER NOT NULL DEFAULT 0,
    "water" INTEGER NOT NULL DEFAULT 0,
    "thunder" INTEGER NOT NULL DEFAULT 0,
    "ice" INTEGER NOT NULL DEFAULT 0,
    "dragon" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "WeaknessEntry_monsterId_fkey" FOREIGN KEY ("monsterId") REFERENCES "Monster" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "WeaknessEntry_bodyPartId_fkey" FOREIGN KEY ("bodyPartId") REFERENCES "MonsterBodyPart" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "MonsterAilment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "monsterId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "isCustom" BOOLEAN NOT NULL DEFAULT false,
    "initialResistance" INTEGER NOT NULL DEFAULT 50,
    "nextResistanceThreshold" INTEGER NOT NULL DEFAULT 50,
    "maximumResistance" INTEGER NOT NULL DEFAULT 50,
    "naturalBuildUpDegradation" INTEGER NOT NULL DEFAULT 50,
    "totalEffectiveness" INTEGER NOT NULL DEFAULT 50,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "MonsterAilment_monsterId_fkey" FOREIGN KEY ("monsterId") REFERENCES "Monster" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "MonsterMaterial" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "monsterId" TEXT NOT NULL,
    "rank" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "targetReward" INTEGER NOT NULL DEFAULT 0,
    "captureReward" INTEGER NOT NULL DEFAULT 0,
    "brokenPartReward" INTEGER NOT NULL DEFAULT 0,
    "carveReward" INTEGER NOT NULL DEFAULT 0,
    "dropMaterialReward" INTEGER NOT NULL DEFAULT 0,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "MonsterMaterial_monsterId_fkey" FOREIGN KEY ("monsterId") REFERENCES "Monster" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "MaterialBodyPartDrop" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "materialId" TEXT NOT NULL,
    "bodyPartId" TEXT NOT NULL,
    "chance" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "MaterialBodyPartDrop_materialId_fkey" FOREIGN KEY ("materialId") REFERENCES "MonsterMaterial" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "MaterialBodyPartDrop_bodyPartId_fkey" FOREIGN KEY ("bodyPartId") REFERENCES "MonsterBodyPart" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "MonsterBodyPart_monsterId_idx" ON "MonsterBodyPart"("monsterId");

-- CreateIndex
CREATE UNIQUE INDEX "WeaknessEntry_bodyPartId_key" ON "WeaknessEntry"("bodyPartId");

-- CreateIndex
CREATE INDEX "WeaknessEntry_monsterId_idx" ON "WeaknessEntry"("monsterId");

-- CreateIndex
CREATE INDEX "MonsterAilment_monsterId_idx" ON "MonsterAilment"("monsterId");

-- CreateIndex
CREATE INDEX "MonsterMaterial_monsterId_rank_idx" ON "MonsterMaterial"("monsterId", "rank");

-- CreateIndex
CREATE UNIQUE INDEX "MaterialBodyPartDrop_materialId_bodyPartId_key" ON "MaterialBodyPartDrop"("materialId", "bodyPartId");
