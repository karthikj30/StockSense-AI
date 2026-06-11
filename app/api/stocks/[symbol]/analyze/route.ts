import { NextRequest, NextResponse } from "next/server";

import { getCache, setCache, CACHE_TTL } from "@/lib/cache";
import { analyzeStockWithGemini } from "@/lib/gemini";
import { computeTechnicals } from "@/lib/indicators";
import { getCandleData, getStockQuote, getStockSummary } from "@/lib/stock-data";
import { slugToSymbol } from "@/lib/utils/formatters";

export const maxDuration = 60;

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ symbol: string }> }
) {
  const { symbol: slug } = await params;
  const symbol = slugToSymbol(slug);

  let userQuestion: string | undefined;
  try {
    const body = await request.json();
    userQuestion = body?.question ?? body?.userQuestion;
  } catch {
    // optional body
  }

  const cacheKey = `analysis:${symbol}:${new Date().toDateString()}:${userQuestion ?? "default"}`;
  if (!userQuestion) {
    const cached = getCache<string>(cacheKey);
    if (cached) {
      return NextResponse.json({ symbol, analysis: cached });
    }
  }

  try {
    const [quote, summary, candles] = await Promise.all([
      getStockQuote(symbol),
      getStockSummary(symbol),
      getCandleData(symbol, "6mo", "1d"),
    ]);

    if (candles.length < 50) {
      return NextResponse.json(
        { error: "Insufficient data for analysis" },
        { status: 400 }
      );
    }

    const stockInfo = {
      ...quote,
      ...(summary ?? {}),
      sector: summary?.sector || quote.sector,
      industry: summary?.industry || quote.industry,
    };
    const technicalData = computeTechnicals(candles, symbol);
    const analysis = await analyzeStockWithGemini(
      technicalData,
      stockInfo,
      userQuestion
    );

    if (!userQuestion) {
      setCache(cacheKey, analysis, CACHE_TTL.AI_ANALYSIS);
    }

    return NextResponse.json({
      symbol,
      analysis,
      stockInfo,
      technicalData,
      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Analysis failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
