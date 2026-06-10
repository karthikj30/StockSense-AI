import { NextRequest, NextResponse } from "next/server";

import { fetchStockChart } from "@/lib/api/data-service";
import { slugToSymbol } from "@/lib/utils/formatters";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ symbol: string }> }
) {
  const { symbol: slug } = await params;
  const symbol = slugToSymbol(slug);
  const { searchParams } = request.nextUrl;
  const period = searchParams.get("period") ?? "3mo";
  const interval = searchParams.get("interval") ?? "1d";

  try {
    const chart = await fetchStockChart(symbol, period, interval);
    return NextResponse.json(chart);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Chart data unavailable";
    return NextResponse.json({ error: message }, { status: 404 });
  }
}
