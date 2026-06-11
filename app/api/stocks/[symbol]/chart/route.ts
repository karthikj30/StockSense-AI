import { NextRequest, NextResponse } from "next/server";

import { getCache, setCache, CACHE_TTL } from "@/lib/cache";
import { getCandleData } from "@/lib/stock-data";
import { slugToSymbol } from "@/lib/utils/formatters";

export const maxDuration = 30;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ symbol: string }> }
) {
  const { symbol: slug } = await params;
  const symbol = slugToSymbol(slug);
  const { searchParams } = request.nextUrl;
  const period = searchParams.get("period") ?? "3mo";
  const interval = searchParams.get("interval") ?? "1d";

  const cacheKey = `chart:${symbol}:${period}:${interval}`;
  const cached = getCache(cacheKey);
  if (cached) return NextResponse.json(cached);

  try {
    const data = await getCandleData(symbol, period, interval);
    setCache(cacheKey, data, CACHE_TTL.HISTORICAL);
    return NextResponse.json(data);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Chart data unavailable";
    return NextResponse.json({ error: message }, { status: 404 });
  }
}
