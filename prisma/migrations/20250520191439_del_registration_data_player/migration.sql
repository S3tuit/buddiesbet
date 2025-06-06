/*
  Warnings:

  - You are about to drop the column `registeredDate` on the `Player` table. All the data in the column will be lost.
  - You are about to drop the column `registrationData` on the `Player` table. All the data in the column will be lost.
  - You are about to drop the column `registrationTypeCode` on the `Player` table. All the data in the column will be lost.
  - You are about to drop the `RegistrationType` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Player" DROP CONSTRAINT "Player_registrationTypeCode_fkey";

-- AlterTable
ALTER TABLE "Player" DROP COLUMN "registeredDate",
DROP COLUMN "registrationData",
DROP COLUMN "registrationTypeCode";

-- DropTable
DROP TABLE "RegistrationType";
