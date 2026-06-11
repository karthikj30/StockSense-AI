import { NextResponse } from "next/server";

import { getLosersFallback, getNSEGainersLosers } from "@/lib/nse-api";

export const maxDuration = 30;

export async function GET() {
  try {
    const { losers } = await getNSEGainersLosers();
    if (losers.length) return NextResponse.json(losers);
    return NextResponse.json(await getLosersFallback());
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch losers";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
