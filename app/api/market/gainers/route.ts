import { NextResponse } from "next/server";

import { getGainersFallback, getNSEGainersLosers } from "@/lib/nse-api";

export const maxDuration = 30;

export async function GET() {
  try {
    const { gainers } = await getNSEGainersLosers();
    if (gainers.length) return NextResponse.json(gainers);
    return NextResponse.json(await getGainersFallback());
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch gainers";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
