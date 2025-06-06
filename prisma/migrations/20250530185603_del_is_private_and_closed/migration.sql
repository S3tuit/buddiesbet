/*
  Warnings:

  - You are about to drop the column `closed` on the `Bet` table. All the data in the column will be lost.
  - You are about to drop the column `isPrivate` on the `Bet` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Bet" DROP COLUMN "closed",
DROP COLUMN "isPrivate";
