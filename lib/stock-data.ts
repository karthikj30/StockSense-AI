import YahooFinance from "yahoo-finance2";

const yahooFinance = new YahooFinance();

export interface StockQuote {
  symbol: string;
  name: string;
  currentPrice: number;
  change: number;
  changePercent: number;
  volume: number;
  avgVolume: number;
  marketCap: number;
  peRatio: number;
  pbRatio: number;
  eps: number;
  fiftyTwoWeekHigh: number;
  fiftyTwoWeekLow: number;
  sector: string;
  industry: string;
  dividendYield: number;
  exchange: string;
}

export interface CandleData {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

type Period = "1d" | "5d" | "1mo" | "3mo" | "6mo" | "1y" | "2y";
type Interval = "5m" | "15m" | "1h" | "1d" | "1wk";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type YahooQuote = Record<string, any>;

function getPeriodStartDate(period: string): Date {
  const now = new Date();
  const map: Record<string, number> = {
    "1d": 1,
    "5d": 5,
    "1mo": 30,
    "3mo": 90,
    "6mo": 180,
    "1y": 365,
    "2y": 730,
  };
  const days = map[period] ?? 90;
  return new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
}

export async function getStockQuote(symbol: string): Promise<StockQuote> {
  const q = (await yahooFinance.quote(symbol)) as YahooQuote;
  return {
    symbol,
    name: q.longName || q.shortName || symbol,
    currentPrice: q.regularMarketPrice ?? 0,
    change: q.regularMarketChange ?? 0,
    changePercent: q.regularMarketChangePercent ?? 0,
    volume: q.regularMarketVolume ?? 0,
    avgVolume: q.averageDailyVolume10Day ?? 0,
    marketCap: q.marketCap ?? 0,
    peRatio: q.trailingPE ?? 0,
    pbRatio: q.priceToBook ?? 0,
    eps: q.trailingEps ?? 0,
    fiftyTwoWeekHigh: q.fiftyTwoWeekHigh ?? 0,
    fiftyTwoWeekLow: q.fiftyTwoWeekLow ?? 0,
    sector: "",
    industry: "",
    dividendYield: (q.dividendYield ?? 0) * 100,
    exchange: symbol.endsWith(".NS")
      ? "NSE"
      : symbol.endsWith(".BO")
        ? "BSE"
        : "NSE",
  };
}

export async function getCandleData(
  symbol: string,
  period: Period | string = "3mo",
  interval: Interval | string = "1d"
): Promise<CandleData[]> {
  const validInterval = (
    ["5m", "15m", "1h", "1d", "1wk"].includes(interval) ? interval : "1d"
  ) as Interval;
  const validPeriod = (
    ["1d", "5d", "1mo", "3mo", "6mo", "1y", "2y"].includes(period)
      ? period
      : "3mo"
  ) as Period;

  const result = await yahooFinance.chart(symbol, {
    period1: getPeriodStartDate(validPeriod),
    period2: new Date(),
    interval: validInterval,
  });

  return (result.quotes ?? [])
    .filter(
      (r) =>
        r.open != null &&
        r.high != null &&
        r.low != null &&
        r.close != null
    )
    .map((r) => ({
      time: Math.floor(new Date(r.date).getTime() / 1000),
      open: parseFloat(r.open!.toFixed(2)),
      high: parseFloat(r.high!.toFixed(2)),
      low: parseFloat(r.low!.toFixed(2)),
      close: parseFloat(r.close!.toFixed(2)),
      volume: r.volume ?? 0,
    }));
}

export async function getStockSummary(symbol: string) {
  try {
    const summary = await yahooFinance.quoteSummary(symbol, {
      modules: ["summaryProfile", "financialData", "defaultKeyStatistics"],
    });
    return {
      sector: summary.summaryProfile?.sector ?? "",
      industry: summary.summaryProfile?.industry ?? "",
      description: summary.summaryProfile?.longBusinessSummary ?? "",
      country: summary.summaryProfile?.country ?? "",
      employees: summary.summaryProfile?.fullTimeEmployees ?? 0,
      website: summary.summaryProfile?.website ?? "",
      returnOnEquity: summary.financialData?.returnOnEquity ?? 0,
      revenueGrowth: summary.financialData?.revenueGrowth ?? 0,
      debtToEquity: summary.financialData?.debtToEquity ?? 0,
      currentRatio: summary.financialData?.currentRatio ?? 0,
      beta: summary.defaultKeyStatistics?.beta ?? 0,
    };
  } catch {
    return null;
  }
}

export async function batchStockQuotes(symbols: string[]): Promise<StockQuote[]> {
  const results = await Promise.allSettled(symbols.map((s) => getStockQuote(s)));
  return results
    .filter(
      (r): r is PromiseFulfilledResult<StockQuote> => r.status === "fulfilled"
    )
    .map((r) => r.value);
}

export async function getIndexQuote(indexSymbol: string, displayName: string) {
  try {
    const q = (await yahooFinance.quote(indexSymbol)) as YahooQuote;
    return {
      symbol: indexSymbol,
      name: displayName,
      value: parseFloat((q.regularMarketPrice ?? 0).toFixed(2)),
      change: parseFloat((q.regularMarketChange ?? 0).toFixed(2)),
      changePercent: parseFloat((q.regularMarketChangePercent ?? 0).toFixed(2)),
    };
  } catch {
    return {
      symbol: indexSymbol,
      name: displayName,
      value: 0,
      change: 0,
      changePercent: 0,
    };
  }
}
