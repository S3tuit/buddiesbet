import { PrismaClient, Prisma } from "@prisma/client/edge";
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

const betStateTypes: Prisma.BetStateTypeCreateInput[] = [
  { code: 1, description: "Open" },
  { code: 2, description: "Payouts completed" },
  { code: 3, description: "Deadline over, no votes" },
];

export async function main() {
  // Seed Outcome Types
  for (const ot of outcomeTypes) {
    await prisma.outcomeType.upsert({
      where: { code: ot.code },
      update: {},
      create: ot,
    });
  }

  // Seed Odds Types
  for (const ot of oddsTypes) {
    await prisma.oddsType.upsert({
      where: { code: ot.code },
      update: {},
      create: ot,
    });
  }

  // Seed Currency Types
  for (const ct of currencyTypes) {
    await prisma.currencyType.upsert({
      where: { code: ct.code },
      update: {},
      create: ct,
    });
  }

  // Seed Result Types
  for (const rt of resultTypes) {
    await prisma.resultType.upsert({
      where: { code: rt.code },
      update: {},
      create: rt,
    });
  }

  // Seed Bet State Types (new)
  for (const st of betStateTypes) {
    await prisma.betStateType.upsert({
      where: { code: st.code },
      update: {},
      create: st,
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
