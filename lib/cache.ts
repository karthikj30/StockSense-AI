interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

const cache = new Map<string, CacheEntry<unknown>>();

export function setCache<T>(key: string, data: T, ttlSeconds: number): void {
  cache.set(key, { data, timestamp: Date.now(), ttl: ttlSeconds * 1000 });
}

export function getCache<T>(key: string): T | null {
  const entry = cache.get(key) as CacheEntry<T> | undefined;
  if (!entry) return null;
  if (Date.now() - entry.timestamp > entry.ttl) {
    cache.delete(key);
    return null;
  }
  return entry.data;
}

export const CACHE_TTL = {
  AI_ANALYSIS: 24 * 60 * 60,
  DAILY_TIP: 24 * 60 * 60,
  STOCK_QUOTE: 5 * 60,
  INDEX_DATA: 60,
  HISTORICAL: 60 * 60,
  TECHNICALS: 15 * 60,
  NSE_GAINERS: 5 * 60,
};
