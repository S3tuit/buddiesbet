/*
  Warnings:

  - A unique constraint covering the columns `[winningOutcomeId]` on the table `Bet` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Bet" ADD COLUMN     "winningOutcomeId" INTEGER;

-- AlterTable
ALTER TABLE "Outcome" ADD COLUMN     "firstVoteDate" TIMESTAMP(6),
ADD COLUMN     "voterCount" INTEGER NOT NULL DEFAULT 0;

-- CreateIndex
CREATE UNIQUE INDEX "Bet_winningOutcomeId_key" ON "Bet"("winningOutcomeId");

-- AddForeignKey
ALTER TABLE "Bet" ADD CONSTRAINT "Bet_winningOutcomeId_fkey" FOREIGN KEY ("winningOutcomeId") REFERENCES "Outcome"("id") ON DELETE SET NULL ON UPDATE CASCADE;
