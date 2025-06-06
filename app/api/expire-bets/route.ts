"use server";

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { GRACE_DAYS_DEADLINE_HOST_WINNING_OUT } from "@/app/db/codeTables";

export async function GET(request: NextRequest) {
  // 1) Read header
  const incomingSecret = request.headers.get("x-cron-secret");
  const expectedSecret = process.env.CRON_SECRET;

  if (!incomingSecret || incomingSecret !== expectedSecret) {
    // 2) If missing or no match, block the request
    return new NextResponse(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }

  // 3) If is valid, run the UPDATE
  try {
    await prisma.$executeRaw`
      WITH expired AS (
        SELECT id
        FROM "Bet"
        WHERE "winningOutcomeId" IS NULL
          AND "outcomeTypeCode" = (
            SELECT id FROM "OutcomeType" WHERE code = '1'
          )
          AND "outcomeDeadline" < NOW()
      )
      UPDATE "Bet"
      SET "outcomeTypeCode" = (
        SELECT id FROM "OutcomeType" WHERE code = '2'
      ),
          "outcomeDeadline" = NOW() + '${GRACE_DAYS_DEADLINE_HOST_WINNING_OUT} DAYS'
      WHERE EXISTS (SELECT 1 FROM expired WHERE expired.id = "Bet".id);
    `;

    return new NextResponse(null, { status: 204 });
  } catch (err) {
    console.error("Error expiring bets:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
