export interface Lesson {
  id: string;
  moduleId: string;
  moduleTitle: string;
  title: string;
  description: string;
  duration: string;
  order: number;
}

export const LESSONS: Lesson[] = [
  // Module 1 — Stock Market Basics (5 lessons)
  {
    id: "basics-1",
    moduleId: "basics",
    moduleTitle: "Stock Market Basics",
    title: "What is a Stock?",
    description:
      "Learn what it means to own a piece of a company and how shareholders benefit from business growth.",
    duration: "8 min",
    order: 1,
  },
  {
    id: "basics-2",
    moduleId: "basics",
    moduleTitle: "Stock Market Basics",
    title: "NSE vs BSE — What's the Difference?",
    description:
      "Understand India's two major stock exchanges, how they work, and where most retail investors trade.",
    duration: "10 min",
    order: 2,
  },
  {
    id: "basics-3",
    moduleId: "basics",
    moduleTitle: "Stock Market Basics",
    title: "How Stock Prices Move",
    description:
      "Discover how supply and demand, news, and investor sentiment drive prices up and down every day.",
    duration: "12 min",
    order: 3,
  },
  {
    id: "basics-4",
    moduleId: "basics",
    moduleTitle: "Stock Market Basics",
    title: "Types of Orders: Market, Limit, Stop-Loss",
    description:
      "Master the three essential order types every beginner needs before placing their first trade.",
    duration: "15 min",
    order: 4,
  },
  {
    id: "basics-5",
    moduleId: "basics",
    moduleTitle: "Stock Market Basics",
    title: "Demat Account and How to Start",
    description:
      "Step-by-step guide to opening a Demat account, linking your bank, and making your first investment.",
    duration: "12 min",
    order: 5,
  },

  // Module 2 — Reading Charts (6 lessons)
  {
    id: "charts-1",
    moduleId: "charts",
    moduleTitle: "Reading Charts",
    title: "What is a Candlestick? Reading OHLC",
    description:
      "Decode candlestick charts by understanding Open, High, Low, and Close — the building blocks of price action.",
    duration: "10 min",
    order: 1,
  },
  {
    id: "charts-2",
    moduleId: "charts",
    moduleTitle: "Reading Charts",
    title: "5 Most Important Candlestick Patterns",
    description:
      "Learn to spot Doji, Hammer, Engulfing, Shooting Star, and Marubozu patterns and what they signal.",
    duration: "18 min",
    order: 2,
  },
  {
    id: "charts-3",
    moduleId: "charts",
    moduleTitle: "Reading Charts",
    title: "Support & Resistance Levels",
    description:
      "Identify price floors and ceilings where stocks tend to bounce or stall — key levels for entries and exits.",
    duration: "14 min",
    order: 3,
  },
  {
    id: "charts-4",
    moduleId: "charts",
    moduleTitle: "Reading Charts",
    title: "Trend Lines — Drawing Them Right",
    description:
      "Draw trend lines that actually work. Connect the dots to see whether a stock is in an uptrend or downtrend.",
    duration: "12 min",
    order: 4,
  },
  {
    id: "charts-5",
    moduleId: "charts",
    moduleTitle: "Reading Charts",
    title: "Volume Analysis — The Secret Signal",
    description:
      "Why volume confirms price moves and how to spot accumulation, distribution, and breakout validation.",
    duration: "15 min",
    order: 5,
  },
  {
    id: "charts-6",
    moduleId: "charts",
    moduleTitle: "Reading Charts",
    title: "Timeframes: Which to Use When",
    description:
      "Choose the right chart timeframe for your trading style — from 5-minute intraday to monthly investing views.",
    duration: "10 min",
    order: 6,
  },

  // Module 3 — Technical Indicators (5 lessons)
  {
    id: "indicators-1",
    moduleId: "indicators",
    moduleTitle: "Technical Indicators",
    title: "RSI — The Overbought/Oversold Detector",
    description:
      "Use the Relative Strength Index to spot when a stock may be overextended and due for a reversal.",
    duration: "12 min",
    order: 1,
  },
  {
    id: "indicators-2",
    moduleId: "indicators",
    moduleTitle: "Technical Indicators",
    title: "MACD — Momentum Made Simple",
    description:
      "Understand MACD crossovers and histogram signals to gauge whether momentum is building or fading.",
    duration: "14 min",
    order: 2,
  },
  {
    id: "indicators-3",
    moduleId: "indicators",
    moduleTitle: "Technical Indicators",
    title: "Moving Averages (EMA vs SMA)",
    description:
      "Compare Exponential and Simple Moving Averages and learn which ones traders watch most closely.",
    duration: "12 min",
    order: 3,
  },
  {
    id: "indicators-4",
    moduleId: "indicators",
    moduleTitle: "Technical Indicators",
    title: "Bollinger Bands — Volatility Compass",
    description:
      "Read Bollinger Bands to measure volatility and identify potential breakout or mean-reversion setups.",
    duration: "13 min",
    order: 4,
  },
  {
    id: "indicators-5",
    moduleId: "indicators",
    moduleTitle: "Technical Indicators",
    title: "Combining Indicators (Don't use them alone!)",
    description:
      "Build a confluence-based approach by stacking RSI, MACD, and moving averages for higher-confidence signals.",
    duration: "16 min",
    order: 5,
  },

  // Module 4 — Smart Investing (5 lessons)
  {
    id: "investing-1",
    moduleId: "investing",
    moduleTitle: "Smart Investing",
    title: "Position Sizing: How Much to Invest?",
    description:
      "Apply the 2% risk rule and portfolio allocation principles so no single trade can wipe you out.",
    duration: "12 min",
    order: 1,
  },
  {
    id: "investing-2",
    moduleId: "investing",
    moduleTitle: "Smart Investing",
    title: "Stop Loss: Your Portfolio Airbag",
    description:
      "Set stop-losses that protect your capital without getting stopped out by normal market noise.",
    duration: "10 min",
    order: 2,
  },
  {
    id: "investing-3",
    moduleId: "investing",
    moduleTitle: "Smart Investing",
    title: "Fundamental Analysis Basics (P/E, EPS)",
    description:
      "Evaluate whether a stock is fairly priced using P/E ratio, EPS growth, and key financial metrics.",
    duration: "15 min",
    order: 3,
  },
  {
    id: "investing-4",
    moduleId: "investing",
    moduleTitle: "Smart Investing",
    title: "Long-Term vs Short-Term: Which is Right for You?",
    description:
      "Compare investing horizons, tax implications, and temperament requirements for each approach.",
    duration: "11 min",
    order: 4,
  },
  {
    id: "investing-5",
    moduleId: "investing",
    moduleTitle: "Smart Investing",
    title: "Common Beginner Mistakes to Avoid",
    description:
      "Learn from the most costly rookie errors — FOMO buying, no stop-loss, overtrading, and chasing tips.",
    duration: "14 min",
    order: 5,
  },
];
