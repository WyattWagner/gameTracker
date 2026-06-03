-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Monster" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "gameId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "imageUrl" TEXT,
    "canBeCaptured" BOOLEAN NOT NULL DEFAULT true,
    "favoriteWeaponUsed" TEXT,
    "lastEncounterAt" DATETIME,
    "numberOfHunts" INTEGER NOT NULL DEFAULT 0,
    "hunts" INTEGER NOT NULL DEFAULT 0,
    "wins" INTEGER NOT NULL DEFAULT 0,
    "losses" INTEGER NOT NULL DEFAULT 0,
    "captures" INTEGER NOT NULL DEFAULT 0,
    "failedQuests" INTEGER NOT NULL DEFAULT 0,
    "notes" TEXT,
    "metadata" JSONB,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Monster_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Monster_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Monster" ("canBeCaptured", "captures", "createdAt", "failedQuests", "favoriteWeaponUsed", "gameId", "id", "imageUrl", "lastEncounterAt", "losses", "metadata", "name", "notes", "numberOfHunts", "updatedAt", "userId", "wins") SELECT "canBeCaptured", "captures", "createdAt", "failedQuests", "favoriteWeaponUsed", "gameId", "id", "imageUrl", "lastEncounterAt", "losses", "metadata", "name", "notes", "numberOfHunts", "updatedAt", "userId", "wins" FROM "Monster";
DROP TABLE "Monster";
ALTER TABLE "new_Monster" RENAME TO "Monster";
CREATE INDEX "Monster_userId_gameId_idx" ON "Monster"("userId", "gameId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
