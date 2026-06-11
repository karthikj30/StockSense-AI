import Groq from "groq-sdk";

import { STOCKSENSE_SYSTEM_PROMPT } from "./gemini";

const groq = process.env.GROQ_API_KEY
  ? new Groq({ apiKey: process.env.GROQ_API_KEY })
  : null;

export async function analyzeStockWithGroq(
  technicalData: object,
  stockInfo: object,
  userQuestion?: string
): Promise<string> {
  if (!groq) {
    return getMockAnalysis(stockInfo, technicalData);
  }

  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    max_tokens: 1500,
    temperature: 0.7,
    messages: [
      { role: "system", content: STOCKSENSE_SYSTEM_PROMPT },
      {
        role: "user",
        content: `${userQuestion ? `Question: "${userQuestion}"\n\n` : ""}Stock Info:\n${JSON.stringify(stockInfo, null, 2)}\n\nTechnicals:\n${JSON.stringify(technicalData, null, 2)}`,
      },
    ],
  });
  return (
    completion.choices[0].message.content ?? "Analysis unavailable."
  );
}

export async function chatWithGroq(
  messages: { role: "user" | "assistant"; content: string }[],
  stockContext?: string
): Promise<string> {
  if (!groq) {
    return "Add GROQ_API_KEY or GEMINI_API_KEY for AI chat. ⚠️ Disclaimer: Educational only, not financial advice.";
  }

  const systemContext = stockContext
    ? `${STOCKSENSE_SYSTEM_PROMPT}\n\nCurrent context: ${stockContext}`
    : STOCKSENSE_SYSTEM_PROMPT;

  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    max_tokens: 800,
    messages: [
      { role: "system", content: systemContext },
      ...messages.map((m) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      })),
    ],
  });

  return completion.choices[0].message.content ?? "";
}

function getMockAnalysis(stockInfo: object, technicalData: object): string {
  const info = stockInfo as { name?: string; currentPrice?: number; symbol?: string };
  const tech = technicalData as { rsi?: number; trend?: string; ema50?: number };
  const rsi = tech.rsi ?? 50;
  const rec = rsi > 70 ? "HOLD" : rsi < 30 ? "BUY" : "HOLD";

  return `## 📊 ${info.name || info.symbol} Analysis

**🎯 Recommendation: ${rec}**
**Confidence Score: 6/10**

### 📈 What's Happening Right Now
The stock is in a **${tech.trend || "sideways"}** phase with RSI at ${rsi}.

### 💰 Action Plan
| | Price |
|---|---|
| **Entry Zone** | ₹${((info.currentPrice || 0) * 0.98).toFixed(0)} – ₹${(info.currentPrice || 0).toFixed(0)} |
| **Stop Loss** | ₹${((info.currentPrice || 0) * 0.92).toFixed(0)} |

*⚠️ Disclaimer: Educational analysis only — not SEBI-registered financial advice.*`;
}
