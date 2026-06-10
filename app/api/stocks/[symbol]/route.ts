import { NextRequest, NextResponse } from "next/server";

import { fetchStockInfo, fetchTechnicalData } from "@/lib/api/data-service";
import { slugToSymbol } from "@/lib/utils/formatters";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ symbol: string }> }
) {
  const { symbol: slug } = await params;
  const symbol = slugToSymbol(slug);
  const includeTechnical =
    request.nextUrl.searchParams.get("include") === "technical";

  try {
    const stock = await fetchStockInfo(symbol);

    if (includeTechnical) {
      const technical = await fetchTechnicalData(symbol);
      return NextResponse.json({
        ...(stock as Record<string, unknown>),
        technical,
      });
    }

    return NextResponse.json(stock);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Stock not found";
    return NextResponse.json({ error: message }, { status: 404 });
  }
}
