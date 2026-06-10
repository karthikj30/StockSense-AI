import { NextResponse } from "next/server";

import { fetchGainers } from "@/lib/api/data-service";

export async function GET() {
  try {
    const gainers = await fetchGainers();
    return NextResponse.json(gainers);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch gainers";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
