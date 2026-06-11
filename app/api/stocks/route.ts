import { NextRequest, NextResponse } from "next/server";

import { getCache, setCache, CACHE_TTL } from "@/lib/cache";
import { NSE_TOP_STOCKS } from "@/lib/data/nse-stocks";
import { batchStockQuotes } from "@/lib/stock-data";
import { normalizeSymbol } from "@/lib/utils/formatters";

export const maxDuration = 30;

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const query = searchParams.get("q")?.trim().toLowerCase() ?? "";
  const symbolsParam = searchParams.get("symbols");

  if (symbolsParam) {
    const symbols = symbolsParam
      .split(",")
      .map((s) => normalizeSymbol(s.trim()))
      .filter(Boolean);

    if (!symbols.length) return NextResponse.json([]);

    try {
      const stocks = await batchStockQuotes(symbols);
      return NextResponse.json(stocks);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to fetch stocks";
      return NextResponse.json({ error: message }, { status: 500 });
    }
  }

  let stocks = NSE_TOP_STOCKS;

  if (query) {
    stocks = NSE_TOP_STOCKS.filter(
      (stock) =>
        stock.symbol.toLowerCase().includes(query) ||
        stock.name.toLowerCase().includes(query) ||
        stock.sector.toLowerCase().includes(query) ||
        stock.symbol.replace(".NS", "").toLowerCase().includes(query)
    );
  }

  try {
    const symbols = stocks.map((s) => s.symbol);
    const cacheKey = `stocks:list:${symbols.join(",")}`;
    let liveData = getCache<Awaited<ReturnType<typeof batchStockQuotes>>>(
      cacheKey
    );
    if (!liveData) {
      liveData = await batchStockQuotes(symbols);
      setCache(cacheKey, liveData, CACHE_TTL.STOCK_QUOTE);
    }

    const priceMap = new Map(liveData.map((s) => [s.symbol, s]));
    const enriched = stocks.map((stock) => {
      const live = priceMap.get(stock.symbol);
      return {
        ...stock,
        currentPrice: live?.currentPrice ?? 0,
        changePercent: live?.changePercent ?? 0,
        name: live?.name ?? stock.name,
        sector: live?.sector || stock.sector,
      };
    });

    return NextResponse.json(enriched);
  } catch {
    return NextResponse.json(stocks);
  }
}
