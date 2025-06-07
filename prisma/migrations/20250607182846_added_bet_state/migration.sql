/*
  Warnings:

  - Added the required column `betStateCode` to the `Bet` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Bet" ADD COLUMN     "betStateCode" INTEGER;
UPDATE "Bet"
SET "betStateCode" = 1;
ALTER TABLE "Bet" ALTER COLUMN "betStateCode" SET NOT NULL;

-- CreateTable
CREATE TABLE "BetStateType" (
    "id" SERIAL NOT NULL,
    "code" INTEGER NOT NULL,
    "description" TEXT,

    CONSTRAINT "BetStateType_pkey" PRIMARY KEY ("id")
);

INSERT INTO "BetStateType" (code, description)
VALUES
  (1, 'Open'),
  (2, 'Payouts completed'),
  (3, 'Deadline over, no votes');

-- CreateIndex
CREATE UNIQUE INDEX "BetStateType_code_key" ON "BetStateType"("code");

-- AddForeignKey
ALTER TABLE "Bet" ADD CONSTRAINT "Bet_betStateCode_fkey" FOREIGN KEY ("betStateCode") REFERENCES "BetStateType"("code") ON DELETE RESTRICT ON UPDATE CASCADE;
