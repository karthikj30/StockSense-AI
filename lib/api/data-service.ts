const DATA_SERVICE_URL = process.env.DATA_SERVICE_URL || "http://localhost:8000";

export async function fetchFromDataService<T>(path: string): Promise<T> {
  const res = await fetch(`${DATA_SERVICE_URL}${path}`, {
    next: { revalidate: 60 },
  });
  if (!res.ok) {
    throw new Error(`Data service error: ${res.status}`);
  }
  return res.json();
}

export async function fetchStockInfo(symbol: string) {
  return fetchFromDataService(`/stocks/${symbol}`);
}

export async function fetchStockChart(
  symbol: string,
  period = "3mo",
  interval = "1d"
) {
  return fetchFromDataService(
    `/stocks/${symbol}/chart?period=${period}&interval=${interval}`
  );
}

export async function fetchTechnicalData(symbol: string) {
  return fetchFromDataService(`/stocks/${symbol}/technical`);
}

export async function fetchMarketIndices() {
  return fetchFromDataService("/market/indices");
}

export async function fetchGainers() {
  return fetchFromDataService("/market/gainers");
}

export async function fetchLosers() {
  return fetchFromDataService("/market/losers");
}

export async function fetchTrending() {
  return fetchFromDataService("/market/trending");
}

export async function fetchHeatmap() {
  return fetchFromDataService("/market/heatmap");
}

export async function fetchBatchStocks(symbols: string[]) {
  return fetchFromDataService(
    `/stocks/batch/list?symbols=${symbols.join(",")}`
  );
}
