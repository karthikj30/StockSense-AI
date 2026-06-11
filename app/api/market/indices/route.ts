import { NextResponse } from "next/server";

import { getCache, setCache, CACHE_TTL } from "@/lib/cache";
import { MARKET_INDICES } from "@/lib/data/nse-stocks";
import { getIndexQuote } from "@/lib/stock-data";

export const maxDuration = 30;

export async function GET() {
  const cacheKey = "market:indices";
  const cached = getCache(cacheKey);
  if (cached) return NextResponse.json(cached);

  try {
    const data = await Promise.all(
      MARKET_INDICES.map((idx) => getIndexQuote(idx.symbol, idx.name))
    );
    setCache(cacheKey, data, CACHE_TTL.INDEX_DATA);
    return NextResponse.json(data);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch indices";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
