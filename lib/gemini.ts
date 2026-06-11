import { GoogleGenerativeAI } from "@google/generative-ai";

import { analyzeStockWithGroq, chatWithGroq } from "./groq";

export const STOCKSENSE_SYSTEM_PROMPT = `
You are StockSense AI, an expert Indian stock market analyst and patient teacher.
Your users are complete beginners who have never traded before.

YOUR PERSONALITY:
- Talk like a knowledgeable older brother or didi who loves explaining things
- Use simple Hindi/English mixed analogies where helpful
- Break down every financial term you use immediately after using it
- Be encouraging but honest about risks

WHEN ANALYZING A STOCK, STRUCTURE YOUR RESPONSE EXACTLY LIKE THIS:

## 📊 [STOCK NAME] Analysis

**🎯 Recommendation: [BUY / SELL / HOLD]**
**Confidence Score: [X/10]**

### 📈 What's Happening Right Now
### 🕯️ What the Candles Are Saying
### 📐 Technical Signals
### 💰 Action Plan (Entry, Stop Loss, Targets table)
### 🎒 How Much to Invest?
### ⚠️ Risks to Watch
### 🧠 In Simple Words

Always end with SEBI disclaimer.
`;

function getModel() {
  if (!process.env.GEMINI_API_KEY) return null;
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  return genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
    generationConfig: { maxOutputTokens: 1500, temperature: 0.7 },
  });
}

export async function analyzeStockWithGemini(
  technicalData: object,
  stockInfo: object,
  userQuestion?: string
): Promise<string> {
  const model = getModel();
  if (!model) {
    return analyzeStockWithGroq(technicalData, stockInfo, userQuestion);
  }

  const prompt = `${STOCKSENSE_SYSTEM_PROMPT}

${userQuestion ? `User's specific question: "${userQuestion}"\n` : ""}

Stock Information:
${JSON.stringify(stockInfo, null, 2)}

Technical Analysis Data:
${JSON.stringify(technicalData, null, 2)}

Please provide a complete analysis following the exact structure above.`;

  try {
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error("Gemini error, falling back to Groq:", error);
    return analyzeStockWithGroq(technicalData, stockInfo, userQuestion);
  }
}

export async function generateDailyTipWithGemini(): Promise<{
  title: string;
  content: string;
  category: string;
  difficulty: string;
  emoji: string;
}> {
  const categories = [
    "Candlestick Patterns",
    "Technical Analysis",
    "Risk Management",
    "Market Psychology",
    "NSE/BSE Basics",
    "Fundamental Analysis",
  ];
  const cat = categories[new Date().getDate() % categories.length];

  const model = getModel();
  if (!model) {
    return {
      title: "What is RSI?",
      content:
        "RSI measures if a stock is overbought (above 70) or oversold (below 30). Think of it like a cricket ball hit too high — it might come down! Always combine with other indicators.",
      category: cat,
      difficulty: "Beginner",
      emoji: "📊",
    };
  }

  try {
    const result = await model.generateContent(
      `Generate a practical daily stock tip for Indian beginners about: ${cat}.
Return ONLY JSON: {"title": "catchy title", "content": "2-3 sentences with Indian stock example", "category": "${cat}", "difficulty": "Beginner", "emoji": "emoji"}`
    );
    const text = result.response.text().trim();
    return JSON.parse(text.replace(/```json|```/g, "").trim());
  } catch {
    return {
      title: "Today's Market Tip",
      content: "Start with index funds or large-cap stocks before picking individual shares.",
      category: cat,
      difficulty: "Beginner",
      emoji: "💡",
    };
  }
}

export async function chatWithGemini(
  messages: { role: "user" | "assistant"; content: string }[],
  stockContext?: string
): Promise<string> {
  const model = getModel();
  if (!model) {
    return chatWithGroq(messages, stockContext);
  }

  const systemContext = stockContext
    ? `${STOCKSENSE_SYSTEM_PROMPT}\n\nCurrent context: User is looking at ${stockContext}`
    : `${STOCKSENSE_SYSTEM_PROMPT}\n\nUser is asking a general stock market question.`;

  try {
    const chat = model.startChat({
      history: messages.slice(0, -1).map((m) => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content }],
      })),
      systemInstruction: systemContext,
    });

    const lastMessage = messages[messages.length - 1].content;
    const result = await chat.sendMessage(lastMessage);
    return result.response.text();
  } catch {
    return chatWithGroq(messages, stockContext);
  }
}
