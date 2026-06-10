import { NextRequest, NextResponse } from "next/server";

import { chatWithAI } from "@/lib/api/claude";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const messages = body?.messages as
      | { role: "user" | "assistant"; content: string }[]
      | undefined;
    const stockContext = body?.stockContext as string | undefined;

    if (!messages?.length) {
      return NextResponse.json(
        { error: "messages array is required" },
        { status: 400 }
      );
    }

    const reply = await chatWithAI(messages, stockContext);
    return NextResponse.json({ reply });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Chat request failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
