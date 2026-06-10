"use client";

import { useEffect, useMemo, useState } from "react";

import { DailyTipCard, type DailyTip } from "@/components/dashboard/DailyTipCard";
import { GainersLosers, type MoverStock } from "@/components/dashboard/GainersLosers";
import { MarketOverview, type MarketIndex } from "@/components/dashboard/MarketOverview";
import { MarketPulse } from "@/components/dashboard/MarketPulse";
import { SectorHeatmap, type SectorData } from "@/components/dashboard/SectorHeatmap";
import { StockCard, type StockCardData } from "@/components/dashboard/StockCard";
import { WatchlistWidget } from "@/components/dashboard/WatchlistWidget";

interface CandlePoint {
  close: number;
}

async function fetchJson<T>(url: string): Promise<T | null> {
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    return res.json() as Promise<T>;
  } catch {
    return null;
  }
}

async function fetchSparkline(symbol: string): Promise<number[]> {
  const data = await fetchJson<CandlePoint[]>(
    `/api/stocks/${encodeURIComponent(symbol)}/chart?period=5d&interval=1d`
  );
  if (!data?.length) return [];
  return data.map((c) => c.close);
}

function computeMoodScore(indices: MarketIndex[]): {
  score: number;
  avgChange: number;
} {
  if (!indices.length) return { score: 50, avgChange: 0 };

  const avgChange =
    indices.reduce((sum, idx) => sum + idx.changePercent, 0) / indices.length;

  const score = Math.round(Math.min(100, Math.max(0, 50 + avgChange * 8)));
  return { score, avgChange };
}

export default function DashboardPage() {
  const [indices, setIndices] = useState<MarketIndex[]>([]);
  const [gainers, setGainers] = useState<MoverStock[]>([]);
  const [losers, setLosers] = useState<MoverStock[]>([]);
  const [trending, setTrending] = useState<StockCardData[]>([]);
  const [sectors, setSectors] = useState<SectorData[]>([]);
  const [tip, setTip] = useState<DailyTip | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      setLoading(true);

      const [
        indicesData,
        gainersData,
        losersData,
        trendingData,
        heatmapData,
        tipData,
      ] = await Promise.all([
        fetchJson<MarketIndex[]>("/api/market/indices"),
        fetchJson<MoverStock[]>("/api/market/gainers"),
        fetchJson<MoverStock[]>("/api/market/losers"),
        fetchJson<StockCardData[]>("/api/market/trending"),
        fetchJson<SectorData[]>("/api/market/heatmap"),
        fetchJson<DailyTip>("/api/ai/daily-tip"),
      ]);

      const indicesWithSparklines = await Promise.all(
        (indicesData ?? []).map(async (index) => ({
          ...index,
          sparkline: await fetchSparkline(index.symbol),
        }))
      );

      const trendingWithSparklines = await Promise.all(
        (trendingData ?? []).slice(0, 8).map(async (stock) => ({
          ...stock,
          sparkline: await fetchSparkline(stock.symbol),
        }))
      );

      setIndices(indicesWithSparklines);
      setGainers(gainersData ?? []);
      setLosers(losersData ?? []);
      setTrending(trendingWithSparklines);
      setSectors(heatmapData ?? []);
      setTip(tipData);
      setLoading(false);
    }

    loadDashboard();
  }, []);

  const { score: moodScore, avgChange } = useMemo(
    () => computeMoodScore(indices),
    [indices]
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground">
          Market Dashboard
        </h1>
        <p className="mt-1 text-sm text-muted">
          Real-time overview of NSE &amp; BSE indices, movers, and AI insights
        </p>
      </div>

      <MarketOverview indices={indices} loading={loading} />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <section>
            <h2 className="mb-4 font-display text-lg font-semibold text-foreground">
              Trending Stocks
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {loading
                ? Array.from({ length: 4 }).map((_, i) => (
                    <div
                      key={i}
                      className="h-32 animate-pulse rounded-xl bg-surface2"
                    />
                  ))
                : trending.map((stock) => (
                    <StockCard key={stock.symbol} stock={stock} />
                  ))}
            </div>
          </section>

          <GainersLosers
            gainers={gainers}
            losers={losers}
            loading={loading}
          />

          <SectorHeatmap sectors={sectors} loading={loading} />
        </div>

        <div className="space-y-6">
          <DailyTipCard tip={tip} loading={loading} />
          <MarketPulse
            moodScore={moodScore}
            avgChange={avgChange}
            loading={loading}
          />
          <WatchlistWidget />
        </div>
      </div>

      <footer className="rounded-lg border border-surface2 bg-surface p-4 lg:hidden">
        <p className="text-center text-xs text-muted">
          ⚠️ Disclaimer: StockSense AI provides educational market analysis
          only, not financial advice. Consult a SEBI-registered advisor before
          investing.
        </p>
      </footer>
    </div>
  );
}
