import { NextRequest, NextResponse } from "next/server";

import { fetchBatchStocks } from "@/lib/api/data-service";
import { NSE_TOP_STOCKS } from "@/lib/data/nse-stocks";
import { normalizeSymbol } from "@/lib/utils/formatters";

interface LiveStock {
  symbol: string;
  name?: string;
  sector?: string;
  currentPrice?: number;
  changePercent?: number;
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const query = searchParams.get("q")?.trim().toLowerCase() ?? "";
  const symbolsParam = searchParams.get("symbols");

  if (symbolsParam) {
    const symbols = symbolsParam
      .split(",")
      .map((s) => normalizeSymbol(s.trim()))
      .filter(Boolean);

    if (!symbols.length) {
      return NextResponse.json([]);
    }

    try {
      const stocks = (await fetchBatchStocks(symbols)) as LiveStock[];
      return NextResponse.json(stocks);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to fetch stocks";
      return NextResponse.json({ error: message }, { status: 502 });
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
    const liveData = (await fetchBatchStocks(symbols)) as LiveStock[];
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
