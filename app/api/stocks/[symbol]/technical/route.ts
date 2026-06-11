import { NextResponse } from "next/server";

import { getCache, setCache, CACHE_TTL } from "@/lib/cache";
import { computeTechnicals } from "@/lib/indicators";
import { getCandleData } from "@/lib/stock-data";
import { slugToSymbol } from "@/lib/utils/formatters";

export const maxDuration = 30;

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ symbol: string }> }
) {
  const { symbol: slug } = await params;
  const symbol = slugToSymbol(slug);
  const cacheKey = `technical:${symbol}`;
  const cached = getCache(cacheKey);
  if (cached) return NextResponse.json(cached);

  try {
    const candles = await getCandleData(symbol, "6mo", "1d");
    const technical = computeTechnicals(candles, symbol);
    setCache(cacheKey, technical, CACHE_TTL.TECHNICALS);
    return NextResponse.json(technical);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Technical data unavailable";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
