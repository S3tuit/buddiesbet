-- CreateTable
CREATE TABLE "RegistrationType" (
    "id" SERIAL NOT NULL,
    "code" INTEGER NOT NULL,
    "description" TEXT,

    CONSTRAINT "RegistrationType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Player" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "registeredDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "registrationTypeCode" INTEGER NOT NULL,
    "registrationData" JSONB,
    "password" TEXT,
    "rubyAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "crystalBallAmount" DOUBLE PRECISION NOT NULL DEFAULT 100,

    CONSTRAINT "Player_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OutcomeType" (
    "id" SERIAL NOT NULL,
    "code" INTEGER NOT NULL,
    "description" TEXT,

    CONSTRAINT "OutcomeType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OddsType" (
    "id" SERIAL NOT NULL,
    "code" INTEGER NOT NULL,
    "description" TEXT,

    CONSTRAINT "OddsType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Bet" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "creatorId" INTEGER,
    "betDeadline" TIMESTAMP(3) NOT NULL,
    "outcomeDeadline" TIMESTAMP(3) NOT NULL,
    "closed" BOOLEAN NOT NULL DEFAULT false,
    "outcomeDecided" BOOLEAN NOT NULL DEFAULT false,
    "outcomeTypeCode" INTEGER NOT NULL,
    "oddsTypeCode" INTEGER NOT NULL,
    "isPrivate" BOOLEAN NOT NULL DEFAULT false,
    "password" TEXT,

    CONSTRAINT "Bet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Outcome" (
    "id" SERIAL NOT NULL,
    "betId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "odds" DOUBLE PRECISION,

    CONSTRAINT "Outcome_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CurrencyType" (
    "id" SERIAL NOT NULL,
    "code" INTEGER NOT NULL,
    "description" TEXT,

    CONSTRAINT "CurrencyType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ResultType" (
    "id" SERIAL NOT NULL,
    "code" INTEGER NOT NULL,
    "description" TEXT,

    CONSTRAINT "ResultType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BetParticipation" (
    "id" SERIAL NOT NULL,
    "playerId" INTEGER NOT NULL,
    "betId" INTEGER NOT NULL,
    "outcomeId" INTEGER NOT NULL,
    "amountBet" DOUBLE PRECISION NOT NULL,
    "currencyCode" INTEGER NOT NULL,
    "resultCode" INTEGER NOT NULL,
    "payout" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BetParticipation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RegistrationType_code_key" ON "RegistrationType"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Player_username_key" ON "Player"("username");

-- CreateIndex
CREATE UNIQUE INDEX "OutcomeType_code_key" ON "OutcomeType"("code");

-- CreateIndex
CREATE UNIQUE INDEX "OddsType_code_key" ON "OddsType"("code");

-- CreateIndex
CREATE UNIQUE INDEX "CurrencyType_code_key" ON "CurrencyType"("code");

-- CreateIndex
CREATE UNIQUE INDEX "ResultType_code_key" ON "ResultType"("code");

-- AddForeignKey
ALTER TABLE "Player" ADD CONSTRAINT "Player_registrationTypeCode_fkey" FOREIGN KEY ("registrationTypeCode") REFERENCES "RegistrationType"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bet" ADD CONSTRAINT "Bet_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "Player"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bet" ADD CONSTRAINT "Bet_outcomeTypeCode_fkey" FOREIGN KEY ("outcomeTypeCode") REFERENCES "OutcomeType"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bet" ADD CONSTRAINT "Bet_oddsTypeCode_fkey" FOREIGN KEY ("oddsTypeCode") REFERENCES "OddsType"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Outcome" ADD CONSTRAINT "Outcome_betId_fkey" FOREIGN KEY ("betId") REFERENCES "Bet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BetParticipation" ADD CONSTRAINT "BetParticipation_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BetParticipation" ADD CONSTRAINT "BetParticipation_betId_fkey" FOREIGN KEY ("betId") REFERENCES "Bet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BetParticipation" ADD CONSTRAINT "BetParticipation_outcomeId_fkey" FOREIGN KEY ("outcomeId") REFERENCES "Outcome"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BetParticipation" ADD CONSTRAINT "BetParticipation_currencyCode_fkey" FOREIGN KEY ("currencyCode") REFERENCES "CurrencyType"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BetParticipation" ADD CONSTRAINT "BetParticipation_resultCode_fkey" FOREIGN KEY ("resultCode") REFERENCES "ResultType"("code") ON DELETE RESTRICT ON UPDATE CASCADE;
