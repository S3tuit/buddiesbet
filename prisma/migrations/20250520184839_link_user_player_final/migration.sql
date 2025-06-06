/*
  Warnings:

  - You are about to drop the column `justtest` on the `Player` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Player_justtest_key";

-- AlterTable
ALTER TABLE "Player" DROP COLUMN "justtest";

-- AddForeignKey
ALTER TABLE "Player" ADD CONSTRAINT "Player_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
