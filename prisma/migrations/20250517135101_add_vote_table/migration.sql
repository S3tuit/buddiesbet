/*
  Warnings:

  - You are about to drop the column `firstVoteDate` on the `Outcome` table. All the data in the column will be lost.
  - You are about to drop the column `voterCount` on the `Outcome` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Outcome" DROP COLUMN "firstVoteDate",
DROP COLUMN "voterCount";

-- CreateTable
CREATE TABLE "Vote" (
    "outcomeId" INTEGER NOT NULL,
    "playerId" INTEGER NOT NULL,
    "votedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Vote_pkey" PRIMARY KEY ("outcomeId","playerId")
);

-- CreateIndex
CREATE INDEX "Vote_playerId_idx" ON "Vote"("playerId");

-- AddForeignKey
ALTER TABLE "Vote" ADD CONSTRAINT "Vote_outcomeId_fkey" FOREIGN KEY ("outcomeId") REFERENCES "Outcome"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vote" ADD CONSTRAINT "Vote_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player"("id") ON DELETE CASCADE ON UPDATE CASCADE;
