"use client";

import { useRef, useState } from "react";
import { Loader2, MessageCircle, Send } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface StockChatbotProps {
  symbol: string;
  stockName?: string;
}

const STARTER_QUESTIONS = [
  "Should I buy this stock now?",
  "What does the RSI tell me?",
  "Explain the recent candlestick pattern",
  "What are the main risks?",
];

export function StockChatbot({ symbol, stockName }: StockChatbotProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  async function sendMessage(text: string) {
    if (!text.trim() || loading) return;

    const userMessage: Message = { role: "user", content: text.trim() };
    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: nextMessages,
          stockContext: `${symbol} (${stockName ?? symbol})`,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Chat failed");

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.reply },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Sorry, I couldn't process that. Please try again in a moment.",
        },
      ]);
    } finally {
      setLoading(false);
      setTimeout(() => {
        scrollRef.current?.scrollTo({
          top: scrollRef.current.scrollHeight,
          behavior: "smooth",
        });
      }, 100);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-display text-lg">
          <MessageCircle className="h-5 w-5 text-brand" />
          Ask about {symbol.replace(".NS", "")}
        </CardTitle>
        <p className="text-sm text-muted">
          Per-stock Q&amp;A — ask anything about this company
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {messages.length === 0 && (
          <div className="flex flex-wrap gap-2">
            {STARTER_QUESTIONS.map((q) => (
              <button
                key={q}
                type="button"
                onClick={() => sendMessage(q)}
                className="rounded-full border border-surface2 bg-surface2/50 px-3 py-1.5 text-xs text-muted transition-colors hover:border-brand/40 hover:text-foreground"
              >
                {q}
              </button>
            ))}
          </div>
        )}

        <div
          ref={scrollRef}
          className="max-h-80 space-y-3 overflow-y-auto rounded-lg border border-surface2 bg-surface2/20 p-3"
        >
          {messages.length === 0 && (
            <p className="py-6 text-center text-sm text-muted">
              No messages yet. Try a starter question above.
            </p>
          )}
          {messages.map((msg, i) => (
            <div
              key={i}
              className={
                msg.role === "user"
                  ? "ml-8 rounded-lg bg-brand/10 p-3 text-sm text-foreground"
                  : "mr-8 rounded-lg bg-surface2 p-3 text-sm text-muted"
              }
            >
              {msg.content}
            </div>
          ))}
          {loading && (
            <div className="flex items-center gap-2 text-sm text-muted">
              <Loader2 className="h-4 w-4 animate-spin" />
              Thinking…
            </div>
          )}
        </div>

        <form
          className="flex gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage(input);
          }}
        >
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Ask about ${symbol.replace(".NS", "")}…`}
            disabled={loading}
          />
          <Button type="submit" size="icon" disabled={loading || !input.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
