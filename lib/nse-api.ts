import { batchStockQuotes } from "./stock-data";
import { getCache, setCache, CACHE_TTL } from "./cache";

let nseSession: { cookies: string; lastRefresh: number } | null = null;
const NSE_BASE = "https://www.nseindia.com/api";

async function getNSEHeaders(): Promise<Record<string, string>> {
  const headers: Record<string, string> = {
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    Accept: "application/json, text/plain, */*",
    "Accept-Language": "en-US,en;q=0.9",
    Referer: "https://www.nseindia.com",
    Connection: "keep-alive",
  };

  if (!nseSession || Date.now() - nseSession.lastRefresh > 10 * 60 * 1000) {
    try {
      const res = await fetch("https://www.nseindia.com", { headers });
      const cookies = res.headers.get("set-cookie") ?? "";
      nseSession = { cookies, lastRefresh: Date.now() };
    } catch {
      // ignore
    }
  }

  if (nseSession?.cookies) headers["Cookie"] = nseSession.cookies;
  return headers;
}

export async function getNSEGainersLosers(): Promise<{
  gainers: Array<{
    symbol: string;
    name: string;
    change: number;
    changePercent: number;
    lastPrice: number;
  }>;
  losers: Array<{
    symbol: string;
    name: string;
    change: number;
    changePercent: number;
    lastPrice: number;
  }>;
}> {
  const cacheKey = "nse:gainers-losers";
  const cached = getCache<{
    gainers: Array<{
      symbol: string;
      name: string;
      change: number;
      changePercent: number;
      lastPrice: number;
    }>;
    losers: Array<{
      symbol: string;
      name: string;
      change: number;
      changePercent: number;
      lastPrice: number;
    }>;
  }>(cacheKey);
  if (cached) return cached;

  try {
    const headers = await getNSEHeaders();
    const [gainRes, lossRes] = await Promise.all([
      fetch(`${NSE_BASE}/live-analysis-variations?index=gainers`, { headers }),
      fetch(`${NSE_BASE}/live-analysis-variations?index=loosers`, { headers }),
    ]);

    const [gainData, lossData] = await Promise.all([
      gainRes.json(),
      lossRes.json(),
    ]);

    const gainers = (gainData?.NIFTY?.data ?? []).slice(0, 5).map(
      (s: {
        symbol: string;
        netPrice: number;
        perChange: number;
        ltp: number;
      }) => ({
        symbol: s.symbol + ".NS",
        name: s.symbol,
        change: s.netPrice,
        changePercent: s.perChange,
        lastPrice: s.ltp,
      })
    );

    const losers = (lossData?.NIFTY?.data ?? []).slice(0, 5).map(
      (s: {
        symbol: string;
        netPrice: number;
        perChange: number;
        ltp: number;
      }) => ({
        symbol: s.symbol + ".NS",
        name: s.symbol,
        change: s.netPrice,
        changePercent: s.perChange,
        lastPrice: s.ltp,
      })
    );

    const result = { gainers, losers };
    if (gainers.length || losers.length) {
      setCache(cacheKey, result, CACHE_TTL.NSE_GAINERS);
    }
    return result;
  } catch {
    return { gainers: [], losers: [] };
  }
}

export async function getGainersFallback() {
  const symbols = [
    "TATAMOTORS.NS",
    "ADANIENT.NS",
    "BAJFINANCE.NS",
    "MARUTI.NS",
    "SUNPHARMA.NS",
  ];
  const stocks = await batchStockQuotes(symbols);
  return stocks
    .sort((a, b) => b.changePercent - a.changePercent)
    .slice(0, 5)
    .map((s) => ({
      symbol: s.symbol,
      name: s.name,
      change: s.change,
      changePercent: s.changePercent,
      lastPrice: s.currentPrice,
    }));
}

export async function getLosersFallback() {
  const symbols = [
    "ZOMATO.NS",
    "PAYTM.NS",
    "NYKAA.NS",
    "WIPRO.NS",
    "INFY.NS",
  ];
  const stocks = await batchStockQuotes(symbols);
  return stocks
    .sort((a, b) => a.changePercent - b.changePercent)
    .slice(0, 5)
    .map((s) => ({
      symbol: s.symbol,
      name: s.name,
      change: s.change,
      changePercent: s.changePercent,
      lastPrice: s.currentPrice,
    }));
}
