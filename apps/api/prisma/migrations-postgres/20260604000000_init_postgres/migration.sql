-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Game" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Game_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Monster" (
    "id" TEXT NOT NULL,
    "gameId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "imageUrl" TEXT,
    "canBeCaptured" BOOLEAN NOT NULL DEFAULT true,
    "favoriteWeaponUsed" TEXT,
    "lastEncounterAt" TIMESTAMP(3),
    "numberOfHunts" INTEGER NOT NULL DEFAULT 0,
    "hunts" INTEGER NOT NULL DEFAULT 0,
    "wins" INTEGER NOT NULL DEFAULT 0,
    "losses" INTEGER NOT NULL DEFAULT 0,
    "captures" INTEGER NOT NULL DEFAULT 0,
    "failedQuests" INTEGER NOT NULL DEFAULT 0,
    "notes" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Monster_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MonsterBodyPart" (
    "id" TEXT NOT NULL,
    "monsterId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "MonsterBodyPart_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WeaknessEntry" (
    "id" TEXT NOT NULL,
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

    CONSTRAINT "WeaknessEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MonsterAilment" (
    "id" TEXT NOT NULL,
    "monsterId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "isCustom" BOOLEAN NOT NULL DEFAULT false,
    "initialResistance" INTEGER NOT NULL DEFAULT 50,
    "nextResistanceThreshold" INTEGER NOT NULL DEFAULT 50,
    "maximumResistance" INTEGER NOT NULL DEFAULT 50,
    "naturalBuildUpDegradation" INTEGER NOT NULL DEFAULT 50,
    "totalEffectiveness" INTEGER NOT NULL DEFAULT 50,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "MonsterAilment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MonsterMaterial" (
    "id" TEXT NOT NULL,
    "monsterId" TEXT NOT NULL,
    "rank" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "targetReward" INTEGER NOT NULL DEFAULT 0,
    "captureReward" INTEGER NOT NULL DEFAULT 0,
    "brokenPartReward" INTEGER NOT NULL DEFAULT 0,
    "carveReward" INTEGER NOT NULL DEFAULT 0,
    "dropMaterialReward" INTEGER NOT NULL DEFAULT 0,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "MonsterMaterial_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MaterialBodyPartDrop" (
    "id" TEXT NOT NULL,
    "materialId" TEXT NOT NULL,
    "bodyPartId" TEXT NOT NULL,
    "chance" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "MaterialBodyPartDrop_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Quest" (
    "id" TEXT NOT NULL,
    "gameId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "completionStatus" TEXT NOT NULL,
    "timeTakenSeconds" INTEGER,
    "cartCount" INTEGER NOT NULL DEFAULT 0,
    "rewards" TEXT,
    "notes" TEXT,
    "weaponUsed" TEXT,
    "isMultiplayer" BOOLEAN NOT NULL DEFAULT false,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Quest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuestMonster" (
    "questId" TEXT NOT NULL,
    "monsterId" TEXT NOT NULL,

    CONSTRAINT "QuestMonster_pkey" PRIMARY KEY ("questId","monsterId")
);

-- CreateTable
CREATE TABLE "Encounter" (
    "id" TEXT NOT NULL,
    "questId" TEXT NOT NULL,
    "monsterId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "encounterDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "result" TEXT NOT NULL,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Encounter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Drop" (
    "id" TEXT NOT NULL,
    "gameId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "sourceMonsterId" TEXT NOT NULL,
    "questId" TEXT,
    "dropName" TEXT NOT NULL,
    "rarity" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "dateObtained" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Drop_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "Monster_userId_gameId_idx" ON "Monster"("userId", "gameId");

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

-- CreateIndex
CREATE INDEX "Quest_userId_gameId_idx" ON "Quest"("userId", "gameId");

-- CreateIndex
CREATE INDEX "Encounter_userId_encounterDate_idx" ON "Encounter"("userId", "encounterDate");

-- CreateIndex
CREATE INDEX "Drop_userId_gameId_idx" ON "Drop"("userId", "gameId");

-- AddForeignKey
ALTER TABLE "Monster" ADD CONSTRAINT "Monster_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Monster" ADD CONSTRAINT "Monster_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MonsterBodyPart" ADD CONSTRAINT "MonsterBodyPart_monsterId_fkey" FOREIGN KEY ("monsterId") REFERENCES "Monster"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WeaknessEntry" ADD CONSTRAINT "WeaknessEntry_monsterId_fkey" FOREIGN KEY ("monsterId") REFERENCES "Monster"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WeaknessEntry" ADD CONSTRAINT "WeaknessEntry_bodyPartId_fkey" FOREIGN KEY ("bodyPartId") REFERENCES "MonsterBodyPart"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MonsterAilment" ADD CONSTRAINT "MonsterAilment_monsterId_fkey" FOREIGN KEY ("monsterId") REFERENCES "Monster"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MonsterMaterial" ADD CONSTRAINT "MonsterMaterial_monsterId_fkey" FOREIGN KEY ("monsterId") REFERENCES "Monster"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MaterialBodyPartDrop" ADD CONSTRAINT "MaterialBodyPartDrop_materialId_fkey" FOREIGN KEY ("materialId") REFERENCES "MonsterMaterial"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MaterialBodyPartDrop" ADD CONSTRAINT "MaterialBodyPartDrop_bodyPartId_fkey" FOREIGN KEY ("bodyPartId") REFERENCES "MonsterBodyPart"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Quest" ADD CONSTRAINT "Quest_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Quest" ADD CONSTRAINT "Quest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuestMonster" ADD CONSTRAINT "QuestMonster_questId_fkey" FOREIGN KEY ("questId") REFERENCES "Quest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuestMonster" ADD CONSTRAINT "QuestMonster_monsterId_fkey" FOREIGN KEY ("monsterId") REFERENCES "Monster"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Encounter" ADD CONSTRAINT "Encounter_questId_fkey" FOREIGN KEY ("questId") REFERENCES "Quest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Encounter" ADD CONSTRAINT "Encounter_monsterId_fkey" FOREIGN KEY ("monsterId") REFERENCES "Monster"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Encounter" ADD CONSTRAINT "Encounter_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Drop" ADD CONSTRAINT "Drop_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Drop" ADD CONSTRAINT "Drop_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Drop" ADD CONSTRAINT "Drop_sourceMonsterId_fkey" FOREIGN KEY ("sourceMonsterId") REFERENCES "Monster"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Drop" ADD CONSTRAINT "Drop_questId_fkey" FOREIGN KEY ("questId") REFERENCES "Quest"("id") ON DELETE SET NULL ON UPDATE CASCADE;

