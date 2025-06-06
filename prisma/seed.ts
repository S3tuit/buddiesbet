import { PrismaClient, Prisma } from "../app/generated/prisma";
import { withAccelerate } from "@prisma/extension-accelerate";

const prisma = new PrismaClient().$extends(withAccelerate());

const outcomeTypes: Prisma.OutcomeTypeCreateInput[] = [
  { code: 1, description: "Creator" },
  { code: 2, description: "Vote" },
];

const oddsTypes: Prisma.OddsTypeCreateInput[] = [
  { code: 1, description: "Auto" },
  { code: 2, description: "Manual" },
];

const currencyTypes: Prisma.CurrencyTypeCreateInput[] = [
  { code: 1, description: "Crystal Ball" },
  { code: 2, description: "Ruby" },
];

const resultTypes: Prisma.ResultTypeCreateInput[] = [
  { code: 1, description: "Win" },
  { code: 2, description: "Lose" },
  { code: 3, description: "Pending" },
];

export async function main() {
  // Seed Outcome Types
  for (const ot of outcomeTypes) {
    await prisma.outcomeType.create({ data: ot });
  }

  // Seed Odds Types
  for (const ot of oddsTypes) {
    await prisma.oddsType.create({ data: ot });
  }

  // Seed Currency Types
  for (const ct of currencyTypes) {
    await prisma.currencyType.create({ data: ct });
  }

  // Seed Result Types
  for (const rt of resultTypes) {
    await prisma.resultType.create({ data: rt });
  }
}

main();
