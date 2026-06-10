import { NextRequest, NextResponse } from "next/server";

import { analyzeStock } from "@/lib/api/claude";
import {
  fetchStockInfo,
  fetchTechnicalData,
} from "@/lib/api/data-service";
import { slugToSymbol } from "@/lib/utils/formatters";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ symbol: string }> }
) {
  const { symbol: slug } = await params;
  const symbol = slugToSymbol(slug);

  let question: string | undefined;
  try {
    const body = await request.json();
    question = body?.question;
  } catch {
    // optional body
  }

  try {
    const [stockInfo, technicalData] = await Promise.all([
      fetchStockInfo(symbol),
      fetchTechnicalData(symbol),
    ]);

    const analysis = await analyzeStock(
      technicalData as object,
      stockInfo as object,
      question
    );

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
