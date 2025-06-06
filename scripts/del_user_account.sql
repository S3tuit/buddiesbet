-- pnpm prisma db execute --file=scripts/del_user_account.sql --schema=prisma/schema.prisma

TRUNCATE TABLE "Account", "User" RESTART IDENTITY CASCADE;
