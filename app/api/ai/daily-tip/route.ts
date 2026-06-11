import { NextResponse } from "next/server";

import { getCache, setCache, CACHE_TTL } from "@/lib/cache";
import { generateDailyTipWithGemini } from "@/lib/gemini";

export const maxDuration = 30;

export async function GET() {
  const key = `daily-tip:${new Date().toDateString()}`;
  const cached = getCache(key);
  if (cached) {
    return NextResponse.json(cached, {
      headers: {
        "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=3600",
      },
    });
  }

  try {
    const tip = await generateDailyTipWithGemini();
    setCache(key, tip, CACHE_TTL.DAILY_TIP);
    return NextResponse.json(tip, {
      headers: {
        "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=3600",
      },
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to generate tip";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
