import { NextResponse } from "next/server";

import { getCache, setCache, CACHE_TTL } from "@/lib/cache";
import { batchStockQuotes } from "@/lib/stock-data";

export const maxDuration = 30;

const SECTORS: Record<string, string[]> = {
  Banking: ["HDFCBANK.NS", "ICICIBANK.NS", "SBIN.NS", "KOTAKBANK.NS"],
  IT: ["TCS.NS", "INFY.NS", "WIPRO.NS", "HCLTECH.NS"],
  Auto: ["TATAMOTORS.NS", "MARUTI.NS", "M&M.NS", "EICHERMOT.NS"],
  Pharma: ["SUNPHARMA.NS", "CIPLA.NS", "DRREDDY.NS", "DIVISLAB.NS"],
  Energy: ["RELIANCE.NS", "ONGC.NS", "BPCL.NS", "TATAPOWER.NS"],
  FMCG: ["HINDUNILVR.NS", "ITC.NS", "NESTLEIND.NS", "GODREJCP.NS"],
};

export async function GET() {
  const cacheKey = "market:heatmap";
  const cached = getCache(cacheKey);
  if (cached) return NextResponse.json(cached);

  try {
    const result = await Promise.all(
      Object.entries(SECTORS).map(async ([sector, symbols]) => {
        const stocks = await batchStockQuotes(symbols);
        const avgChange =
          stocks.length > 0
            ? stocks.reduce((sum, s) => sum + s.changePercent, 0) /
              stocks.length
            : 0;
        return {
          sector,
          changePercent: parseFloat(avgChange.toFixed(2)),
          stocks: stocks.length,
        };
      })
    );

    setCache(cacheKey, result, CACHE_TTL.STOCK_QUOTE);
    return NextResponse.json(result);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch heatmap";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
