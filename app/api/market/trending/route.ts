import { NextResponse } from "next/server";

import { getCache, setCache, CACHE_TTL } from "@/lib/cache";
import { batchStockQuotes } from "@/lib/stock-data";

export const maxDuration = 30;

const TRENDING = [
  "RELIANCE.NS",
  "TCS.NS",
  "INFY.NS",
  "HDFCBANK.NS",
  "ICICIBANK.NS",
  "WIPRO.NS",
  "TATAMOTORS.NS",
  "BAJFINANCE.NS",
  "SUNPHARMA.NS",
  "ADANIENT.NS",
  "SBIN.NS",
  "MARUTI.NS",
];

export async function GET() {
  const cacheKey = "market:trending";
  const cached = getCache(cacheKey);
  if (cached) return NextResponse.json(cached);

  try {
    const data = await batchStockQuotes(TRENDING);
    setCache(cacheKey, data, CACHE_TTL.STOCK_QUOTE);
    return NextResponse.json(data);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch trending";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
