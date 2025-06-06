"use server";

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    // Use $executeRaw for non‐select queries. It returns a number (rows affected).
    const count = await prisma.$executeRaw`
      CREATE EXTENSION IF NOT EXISTS pg_cron;`;

    // $executeRaw returns the number of rows updated (e.g. 5).
    return NextResponse.json({ updatedCount: count });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error updating expired bets" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
