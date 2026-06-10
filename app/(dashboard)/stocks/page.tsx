"use client";

import { useCallback, useEffect, useState } from "react";
import { Search } from "lucide-react";
import Link from "next/link";

import { MiniSparkline } from "@/components/charts/MiniSparkline";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  formatIndianCurrency,
  formatPercent,
} from "@/lib/utils/formatters";
import { cn } from "@/lib/utils";

interface ExploreStock {
  symbol: string;
  name: string;
  sector: string;
  currentPrice?: number;
  changePercent?: number;
  sparkline?: number[];
}

export default function StocksPage() {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [stocks, setStocks] = useState<ExploreStock[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 300);
    return () => clearTimeout(timer);
  }, [query]);

  const loadStocks = useCallback(async () => {
    setLoading(true);
    try {
      const params = debouncedQuery ? `?q=${encodeURIComponent(debouncedQuery)}` : "";
      const res = await fetch(`/api/stocks${params}`);
      if (!res.ok) throw new Error("Failed to load");
      const data = (await res.json()) as ExploreStock[];

      const withSparklines = await Promise.all(
        data.map(async (stock) => {
          try {
            const chartRes = await fetch(
              `/api/stocks/${encodeURIComponent(stock.symbol)}/chart?period=5d&interval=1d`
            );
            if (!chartRes.ok) return stock;
            const candles = (await chartRes.json()) as { close: number }[];
            return {
              ...stock,
              sparkline: candles.map((c) => c.close),
            };
          } catch {
            return stock;
          }
        })
      );

      setStocks(withSparklines);
    } catch {
      setStocks([]);
    } finally {
      setLoading(false);
    }
  }, [debouncedQuery]);

  useEffect(() => {
    loadStocks();
  }, [loadStocks]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground">
          Explore Stocks
        </h1>
        <p className="mt-1 text-sm text-muted">
          Search NSE top stocks by name, symbol, or sector
        </p>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search RELIANCE, banking, IT…"
          className="pl-9"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {loading
          ? Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-36 rounded-xl" />
            ))
          : stocks.map((stock) => {
              const isUp = (stock.changePercent ?? 0) >= 0;
              const slug = encodeURIComponent(stock.symbol);

              return (
                <Link key={stock.symbol} href={`/stocks/${slug}`}>
                  <Card className="h-full transition-colors hover:border-brand/40 hover:bg-surface2/50">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <p className="truncate font-display text-sm font-semibold text-foreground">
                              {stock.symbol.replace(".NS", "")}
                            </p>
                            <Badge variant="secondary" className="shrink-0 text-[10px]">
                              {stock.sector}
                            </Badge>
                          </div>
                          <p className="mt-0.5 truncate text-xs text-muted">
                            {stock.name}
                          </p>
                          {stock.currentPrice ? (
                            <>
                              <p className="mt-2 font-medium text-foreground">
                                {formatIndianCurrency(stock.currentPrice)}
                              </p>
                              <p
                                className={cn(
                                  "text-xs font-medium",
                                  isUp ? "text-stock-up" : "text-stock-down"
                                )}
                              >
                                {formatPercent(stock.changePercent ?? 0)}
                              </p>
                            </>
                          ) : (
                            <p className="mt-2 text-xs text-muted">
                              Tap for details
                            </p>
                          )}
                        </div>
                        <MiniSparkline
                          data={stock.sparkline ?? []}
                          width={56}
                          height={36}
                          positive={isUp}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
      </div>

      {!loading && stocks.length === 0 && (
        <p className="py-12 text-center text-sm text-muted">
          No stocks match &ldquo;{debouncedQuery}&rdquo;
        </p>
      )}
    </div>
  );
}
