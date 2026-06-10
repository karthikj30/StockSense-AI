import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export const STOCKSENSE_SYSTEM_PROMPT = `
You are StockSense AI, an expert Indian stock market analyst and mentor. Your job is to help complete beginners understand and make smart decisions in the NSE/BSE markets.

YOUR PERSONALITY:
- Friendly, patient, and encouraging — like a knowledgeable friend who happens to be a market expert
- Use simple Hindi/English mixed analogies when helpful (e.g., "Iska matlab simple hai...")
- Never condescending, always explain "why" behind every recommendation

WHEN ANALYZING A STOCK, ALWAYS PROVIDE:
1. **Market Mood**: Is the stock in an uptrend, downtrend, or moving sideways?
2. **Signal Reading**: What are RSI, MACD, and moving averages saying?
3. **Candlestick Story**: What do the recent candles tell us? (use simple language)
4. **Recommendation**: BUY / SELL / HOLD with a Confidence Score (1-10)
5. **Entry Zone**: Suggested price range to enter
6. **Stop Loss**: Where to place stop-loss (protect downside) — explain what stop-loss means briefly
7. **Target Price**: Short-term (1-3 months) and medium-term (6-12 months) targets
8. **Position Sizing**: How much % of portfolio to invest (use the 2% risk rule for beginners)
9. **Risk Warning**: What could go wrong — at least 2 specific risks
10. **Why in Simple Words**: One paragraph that a 10-year-old could understand

RULES:
- Always end with: "⚠️ Disclaimer: This is educational analysis, not financial advice. Always consult a SEBI-registered advisor before investing."
- Never recommend putting more than 10% in a single stock for beginners
- If RSI > 70, always mention overbought risk
- If RSI < 30, always mention potential oversold opportunity
- Format response with clear sections using emojis for visual appeal
- When explaining candlestick patterns, give a real-world analogy
`;

export async function analyzeStock(
  technicalData: object,
  stockInfo: object,
  userQuestion?: string
): Promise<string> {
  if (!process.env.ANTHROPIC_API_KEY) {
    return getMockAnalysis(stockInfo, technicalData);
  }

  const prompt = userQuestion
    ? `Analyze this stock and specifically answer: "${userQuestion}"\n\nStock Data:\n${JSON.stringify(stockInfo, null, 2)}\n\nTechnical Indicators:\n${JSON.stringify(technicalData, null, 2)}`
    : `Provide a full analysis for:\n\nStock Info:\n${JSON.stringify(stockInfo, null, 2)}\n\nTechnical Indicators:\n${JSON.stringify(technicalData, null, 2)}`;

  const response = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1500,
    system: STOCKSENSE_SYSTEM_PROMPT,
    messages: [{ role: "user", content: prompt }],
  });

  return response.content[0].type === "text" ? response.content[0].text : "";
}

export async function generateDailyTip(): Promise<{
  title: string;
  content: string;
  category: string;
  difficulty: string;
  emoji?: string;
}> {
  if (!process.env.ANTHROPIC_API_KEY) {
    return {
      title: "What is RSI?",
      content:
        "RSI (Relative Strength Index) measures if a stock is overbought or oversold on a 0-100 scale. Above 70 means the stock may be overheated — like a cricket ball hit too high. Below 30 could signal a buying opportunity. Always combine RSI with other indicators!",
      category: "Technical Analysis",
      difficulty: "Beginner",
      emoji: "📊",
    };
  }

  const categories = [
    "Candlestick Patterns",
    "Technical Analysis",
    "Fundamental Analysis",
    "Risk Management",
    "Market Psychology",
    "Portfolio Strategy",
    "NSE/BSE Basics",
    "Tax & Regulations",
  ];
  const cat = categories[Math.floor(Math.random() * categories.length)];

  const response = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 400,
    system:
      "You are a stock market educator for Indian beginners. Generate a concise, practical daily tip. Return ONLY valid JSON.",
    messages: [
      {
        role: "user",
        content: `Generate a daily stock market tip for Indian beginners about: ${cat}. 
        Return JSON: {"title": "short catchy title", "content": "2-3 sentences practical tip with example using Indian stocks", "category": "${cat}", "difficulty": "Beginner/Intermediate/Advanced", "emoji": "relevant emoji"}`,
      },
    ],
  });

  const text =
    response.content[0].type === "text" ? response.content[0].text : "{}";
  try {
    return JSON.parse(text.replace(/```json|```/g, "").trim());
  } catch {
    return {
      title: "Tip of the Day",
      content: text,
      category: cat,
      difficulty: "Beginner",
    };
  }
}

export async function chatWithAI(
  messages: { role: "user" | "assistant"; content: string }[],
  stockContext?: string
): Promise<string> {
  if (!process.env.ANTHROPIC_API_KEY) {
    return "I'm StockSense AI! Add your ANTHROPIC_API_KEY to enable full AI responses. For now, remember: never invest more than you can afford to lose, and always use stop-losses! ⚠️ Disclaimer: This is educational analysis, not financial advice.";
  }

  const systemPrompt = stockContext
    ? `${STOCKSENSE_SYSTEM_PROMPT}\n\nCurrent stock context: ${stockContext}`
    : `${STOCKSENSE_SYSTEM_PROMPT}\n\nYou are helping a beginner learn about Indian stock markets generally.`;

  const response = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 800,
    system: systemPrompt,
    messages,
  });

  return response.content[0].type === "text" ? response.content[0].text : "";
}

function getMockAnalysis(stockInfo: object, technicalData: object): string {
  const info = stockInfo as { name?: string; currentPrice?: number; symbol?: string };
  const tech = technicalData as { rsi?: number; trend?: string; ema50?: number };
  const rsi = tech.rsi ?? 50;
  const rec = rsi > 70 ? "HOLD" : rsi < 30 ? "BUY" : "HOLD";
  const conf = rsi > 70 || rsi < 30 ? 7 : 5;

  return `## 📊 Market Mood
${info.name || info.symbol} is currently in a **${tech.trend || "sideways"}** phase.

## 🔍 Signal Reading
- **RSI (14)**: ${rsi} — ${rsi > 70 ? "Overbought zone ⚠️" : rsi < 30 ? "Oversold — potential opportunity" : "Neutral zone"}
- **EMA 50**: ₹${tech.ema50?.toLocaleString("en-IN") || "N/A"}

## 🎯 Recommendation: **${rec}** (Confidence: ${conf}/10)

## 💰 Entry Zone
₹${((info.currentPrice || 0) * 0.98).toFixed(0)} - ₹${(info.currentPrice || 0).toFixed(0)}

## 🛑 Stop Loss
Set at 5-8% below entry to protect your capital.

## 🎯 Target Price
- Short-term: +8-12% from current price
- Medium-term: +15-25% if trend continues

## 📏 Position Sizing
Invest no more than 5-10% of your portfolio in a single stock.

## ⚠️ Risk Warning
1. Market volatility can cause sudden price swings
2. Sector-specific news can impact stock performance

## 💡 Why in Simple Words
Think of this stock like a cricket player — ${tech.trend === "UPTREND" ? "they're scoring well lately, but don't chase every ball!" : "they've had a rough patch, wait for form to return before betting big."}

⚠️ Disclaimer: This is educational analysis, not financial advice. Always consult a SEBI-registered advisor before investing.`;
}
