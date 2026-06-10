import { NextResponse } from "next/server";

import { fetchLosers } from "@/lib/api/data-service";

export async function GET() {
  try {
    const losers = await fetchLosers();
    return NextResponse.json(losers);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch losers";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
