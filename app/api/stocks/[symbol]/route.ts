import { NextRequest, NextResponse } from "next/server";

import { getCache, setCache, CACHE_TTL } from "@/lib/cache";
import { computeTechnicals } from "@/lib/indicators";
import {
  getCandleData,
  getStockQuote,
  getStockSummary,
} from "@/lib/stock-data";
import { slugToSymbol } from "@/lib/utils/formatters";

export const maxDuration = 30;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ symbol: string }> }
) {
  const { symbol: slug } = await params;
  const symbol = slugToSymbol(slug);
  const includeTechnical =
    request.nextUrl.searchParams.get("include") === "technical";

  const cacheKey = `quote:${symbol}`;
  let data = getCache<Record<string, unknown>>(cacheKey);

  try {
    if (!data) {
      const [quote, summary] = await Promise.all([
        getStockQuote(symbol),
        getStockSummary(symbol),
      ]);
      data = {
        ...quote,
        ...(summary ?? {}),
        sector: summary?.sector || quote.sector,
        industry: summary?.industry || quote.industry,
      };
      setCache(cacheKey, data, CACHE_TTL.STOCK_QUOTE);
    }

    if (includeTechnical) {
      const candles = await getCandleData(symbol, "6mo", "1d");
      const technical = computeTechnicals(candles, symbol);
      return NextResponse.json({ ...data, technical });
    }

    return NextResponse.json(data);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Stock not found";
    return NextResponse.json({ error: message }, { status: 404 });
  }
}
