"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Star } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  formatIndianCurrency,
  formatPercent,
} from "@/lib/utils/formatters";
import { useWatchlistStore } from "@/lib/stores/watchlist.store";

interface WatchlistStock {
  symbol: string;
  name: string;
  currentPrice: number;
  changePercent: number;
}

export function WatchlistWidget() {
  const symbols = useWatchlistStore((s) => s.symbols);
  const [stocks, setStocks] = useState<WatchlistStock[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!symbols.length) {
      setStocks([]);
      return;
    }

    const preview = symbols.slice(0, 5);

    async function fetchWatchlist() {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/stocks?symbols=${preview.join(",")}`
        );
        if (res.ok) {
          const data = (await res.json()) as WatchlistStock[];
          setStocks(data);
        }
      } catch {
        setStocks([]);
      } finally {
        setLoading(false);
      }
    }

    fetchWatchlist();
  }, [symbols]);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="flex items-center gap-2 font-display text-lg">
          <Star className="h-4 w-4 text-brand" />
          Watchlist
        </CardTitle>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/watchlist">View all</Link>
        </Button>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-12 rounded-lg" />
            ))}
          </div>
        ) : !symbols.length ? (
          <div className="py-6 text-center">
            <Star className="mx-auto mb-2 h-8 w-8 text-muted/50" />
            <p className="text-sm text-muted">Your watchlist is empty</p>
            <Button variant="outline" size="sm" className="mt-3" asChild>
              <Link href="/stocks">Explore stocks</Link>
            </Button>
          </div>
        ) : (
          <ul className="space-y-2">
            {stocks.map((stock) => {
              const slug = encodeURIComponent(stock.symbol);
              const isUp = stock.changePercent >= 0;

              return (
                <li key={stock.symbol}>
                  <Link
                    href={`/stocks/${slug}`}
                    className="flex items-center justify-between rounded-lg px-2 py-2 transition-colors hover:bg-surface2"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground">
                        {stock.symbol.replace(".NS", "")}
                      </p>
                      <p className="truncate text-xs text-muted">{stock.name}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-foreground">
                        {formatIndianCurrency(stock.currentPrice)}
                      </p>
                      <Badge
                        variant={isUp ? "success" : "danger"}
                        className="mt-0.5 text-[10px]"
                      >
                        {formatPercent(stock.changePercent)}
                      </Badge>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
