/*
  Warnings:

  - A unique constraint covering the columns `[justtest]` on the table `Player` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Player" ADD COLUMN     "justtest" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Player_justtest_key" ON "Player"("justtest");
