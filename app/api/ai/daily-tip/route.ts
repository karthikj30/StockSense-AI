import { unstable_cache } from "next/cache";
import { NextResponse } from "next/server";

import { generateDailyTip } from "@/lib/api/claude";

const getCachedDailyTip = unstable_cache(
  async () => generateDailyTip(),
  ["daily-tip"],
  { revalidate: 86400, tags: ["daily-tip"] }
);

export async function GET() {
  try {
    const tip = await getCachedDailyTip();
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
