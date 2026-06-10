import { NextResponse } from "next/server";

import { fetchHeatmap } from "@/lib/api/data-service";

export async function GET() {
  try {
    const heatmap = await fetchHeatmap();
    return NextResponse.json(heatmap);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch heatmap";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
