import { NextResponse } from "next/server";

import { fetchMarketIndices } from "@/lib/api/data-service";

export async function GET() {
  try {
    const indices = await fetchMarketIndices();
    return NextResponse.json(indices);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch indices";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
