/*
  Warnings:

  - You are about to drop the column `oddsTypeCode` on the `Bet` table. All the data in the column will be lost.
  - You are about to drop the `OddsType` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Bet" DROP CONSTRAINT "Bet_oddsTypeCode_fkey";

-- AlterTable
ALTER TABLE "Bet" DROP COLUMN "oddsTypeCode";

-- DropTable
DROP TABLE "OddsType";
