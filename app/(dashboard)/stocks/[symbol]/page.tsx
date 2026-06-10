"use client";

import { use, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Star } from "lucide-react";

import { AIAnalysisPanel } from "@/components/analysis/AIAnalysisPanel";
import { StockChatbot } from "@/components/analysis/StockChatbot";
import {
  TechnicalIndicators,
  type TechnicalData,
} from "@/components/analysis/TechnicalIndicators";
import {
  CandlestickChart,
  type CandleData,
} from "@/components/charts/CandlestickChart";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useWatchlistStore } from "@/lib/stores/watchlist.store";
import {
  formatIndianCurrency,
  formatIndianNumber,
  formatPercent,
  slugToSymbol,
} from "@/lib/utils/formatters";
import { cn } from "@/lib/utils";

interface StockInfo {
  symbol: string;
  name: string;
  currentPrice: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap: number;
  peRatio: number;
  pbRatio: number;
  eps: number;
  fiftyTwoWeekHigh: number;
  fiftyTwoWeekLow: number;
  sector: string;
  industry: string;
  dividendYield: number;
}

const PERIODS = [
  { label: "1W", period: "5d", interval: "1d" },
  { label: "1M", period: "1mo", interval: "1d" },
  { label: "3M", period: "3mo", interval: "1d" },
  { label: "6M", period: "6mo", interval: "1d" },
  { label: "1Y", period: "1y", interval: "1d" },
];

export default function StockDetailPage({
  params,
}: {
  params: Promise<{ symbol: string }>;
}) {
  const { symbol: slug } = use(params);
  const symbol = slugToSymbol(slug);

  const [stock, setStock] = useState<StockInfo | null>(null);
  const [technical, setTechnical] = useState<TechnicalData | null>(null);
  const [chartData, setChartData] = useState<CandleData[]>([]);
  const [chartPeriod, setChartPeriod] = useState(PERIODS[2]);
  const [loading, setLoading] = useState(true);
  const [chartLoading, setChartLoading] = useState(true);

  const { has, add, remove } = useWatchlistStore();
  const inWatchlist = has(symbol);

  const loadStock = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/stocks/${encodeURIComponent(symbol)}?include=technical`
      );

      if (res.ok) {
        const data = await res.json();
        const { technical: tech, ...stockInfo } = data;
        setStock(stockInfo as StockInfo);
        setTechnical((tech as TechnicalData) ?? null);
      } else {
        setStock(null);
      }
    } catch {
      setStock(null);
    } finally {
      setLoading(false);
    }
  }, [symbol]);

  const loadChart = useCallback(async () => {
    setChartLoading(true);
    try {
      const res = await fetch(
        `/api/stocks/${encodeURIComponent(symbol)}/chart?period=${chartPeriod.period}&interval=${chartPeriod.interval}`
      );
      if (res.ok) {
        setChartData((await res.json()) as CandleData[]);
      }
    } catch {
      setChartData([]);
    } finally {
      setChartLoading(false);
    }
  }, [symbol, chartPeriod]);

  useEffect(() => {
    loadStock();
  }, [loadStock]);

  useEffect(() => {
    loadChart();
  }, [loadChart]);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-24 rounded-xl" />
        <Skeleton className="h-96 rounded-xl" />
      </div>
    );
  }

  if (!stock) {
    return (
      <div className="py-16 text-center">
        <p className="text-muted">Stock not found: {symbol}</p>
        <Button variant="outline" className="mt-4" asChild>
          <Link href="/stocks">Back to Explore</Link>
        </Button>
      </div>
    );
  }

  const isUp = stock.changePercent >= 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Button variant="ghost" size="sm" className="mb-2 -ml-2" asChild>
            <Link href="/stocks">
              <ArrowLeft className="h-4 w-4" />
              Explore
            </Link>
          </Button>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="font-display text-2xl font-bold text-foreground">
              {stock.symbol.replace(".NS", "")}
            </h1>
            {stock.sector && <Badge variant="secondary">{stock.sector}</Badge>}
          </div>
          <p className="mt-1 text-sm text-muted">{stock.name}</p>
          <div className="mt-2 flex items-baseline gap-3">
            <span className="font-display text-3xl font-bold text-foreground">
              {formatIndianCurrency(stock.currentPrice)}
            </span>
            <span
              className={cn(
                "text-sm font-medium",
                isUp ? "text-stock-up" : "text-stock-down"
              )}
            >
              {formatPercent(stock.changePercent)}
            </span>
          </div>
        </div>
        <Button
          variant={inWatchlist ? "secondary" : "outline"}
          onClick={() => (inWatchlist ? remove(symbol) : add(symbol))}
        >
          <Star
            className={cn("h-4 w-4", inWatchlist && "fill-brand text-brand")}
          />
          {inWatchlist ? "In Watchlist" : "Add to Watchlist"}
        </Button>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="font-display text-lg">Price Chart</CardTitle>
          <div className="flex gap-1">
            {PERIODS.map((p) => (
              <button
                key={p.label}
                type="button"
                onClick={() => setChartPeriod(p)}
                className={cn(
                  "rounded-md px-2.5 py-1 text-xs font-medium transition-colors",
                  chartPeriod.label === p.label
                    ? "bg-brand text-background"
                    : "text-muted hover:bg-surface2 hover:text-foreground"
                )}
              >
                {p.label}
              </button>
            ))}
          </div>
        </CardHeader>
        <CardContent>
          <CandlestickChart
            data={chartData}
            loading={chartLoading}
            height={420}
          />
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="font-display text-lg">Fundamentals</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-2 gap-4 text-sm">
              {[
                ["Market Cap", formatIndianNumber(stock.marketCap)],
                ["P/E Ratio", stock.peRatio?.toFixed(2) ?? "—"],
                ["P/B Ratio", stock.pbRatio?.toFixed(2) ?? "—"],
                ["EPS", formatIndianCurrency(stock.eps)],
                ["52W High", formatIndianCurrency(stock.fiftyTwoWeekHigh)],
                ["52W Low", formatIndianCurrency(stock.fiftyTwoWeekLow)],
                [
                  "Dividend Yield",
                  stock.dividendYield
                    ? `${(stock.dividendYield * 100).toFixed(2)}%`
                    : "—",
                ],
                ["Industry", stock.industry || "—"],
              ].map(([label, value]) => (
                <div key={label}>
                  <dt className="text-xs text-muted">{label}</dt>
                  <dd className="mt-0.5 font-medium text-foreground">{value}</dd>
                </div>
              ))}
            </dl>
          </CardContent>
        </Card>

        <TechnicalIndicators data={technical} loading={!technical} />
      </div>

      <Tabs defaultValue="analysis">
        <TabsList>
          <TabsTrigger value="analysis">AI Analysis</TabsTrigger>
          <TabsTrigger value="chat">Ask AI</TabsTrigger>
        </TabsList>
        <TabsContent value="analysis" className="mt-4">
          <AIAnalysisPanel symbol={symbol} />
        </TabsContent>
        <TabsContent value="chat" className="mt-4">
          <StockChatbot symbol={symbol} stockName={stock.name} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
