import { NextResponse } from "next/server";

import { fetchTrending } from "@/lib/api/data-service";

export async function GET() {
  try {
    const trending = await fetchTrending();
    return NextResponse.json(trending);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch trending";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
