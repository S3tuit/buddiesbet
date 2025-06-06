/*
  Warnings:

  - The primary key for the `Vote` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Added the required column `betId` to the `Vote` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Vote" DROP CONSTRAINT "Vote_pkey",
ADD COLUMN     "betId" INTEGER NOT NULL,
ADD CONSTRAINT "Vote_pkey" PRIMARY KEY ("betId", "playerId");

-- AddForeignKey
ALTER TABLE "Vote" ADD CONSTRAINT "Vote_betId_fkey" FOREIGN KEY ("betId") REFERENCES "Bet"("id") ON DELETE CASCADE ON UPDATE CASCADE;
