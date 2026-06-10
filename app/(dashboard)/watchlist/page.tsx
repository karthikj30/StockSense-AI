"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Search, Star, Trash2 } from "lucide-react";

import { StockCard, type StockCardData } from "@/components/dashboard/StockCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useWatchlistStore } from "@/lib/stores/watchlist.store";
import { normalizeSymbol } from "@/lib/utils/formatters";

export default function WatchlistPage() {
  const { symbols, add, remove } = useWatchlistStore();
  const [stocks, setStocks] = useState<StockCardData[]>([]);
  const [loading, setLoading] = useState(false);
  const [addSymbol, setAddSymbol] = useState("");

  useEffect(() => {
    if (!symbols.length) {
      setStocks([]);
      return;
    }

    async function load() {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/stocks?symbols=${symbols.join(",")}`
        );
        if (res.ok) {
          setStocks((await res.json()) as StockCardData[]);
        }
      } catch {
        setStocks([]);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [symbols]);

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    const sym = normalizeSymbol(addSymbol);
    if (sym) {
      add(sym);
      setAddSymbol("");
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground">
          Watchlist
        </h1>
        <p className="mt-1 text-sm text-muted">
          Track your favourite NSE stocks in one place
        </p>
      </div>

      <form onSubmit={handleAdd} className="flex max-w-md gap-2">
        <Input
          value={addSymbol}
          onChange={(e) => setAddSymbol(e.target.value)}
          placeholder="Add symbol e.g. TCS or RELIANCE"
        />
        <Button type="submit">Add</Button>
      </form>

      {!symbols.length && !loading ? (
        <div className="rounded-xl border border-dashed border-surface2 py-16 text-center">
          <Star className="mx-auto mb-3 h-10 w-10 text-muted/40" />
          <p className="text-sm text-muted">Your watchlist is empty</p>
          <Button variant="outline" className="mt-4" asChild>
            <Link href="/stocks">
              <Search className="h-4 w-4" />
              Explore stocks
            </Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {loading
            ? Array.from({ length: symbols.length || 3 }).map((_, i) => (
                <Skeleton key={i} className="h-32 rounded-xl" />
              ))
            : stocks.map((stock) => (
                <div key={stock.symbol} className="relative">
                  <StockCard stock={stock} />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-2 h-8 w-8 text-muted hover:text-stock-down"
                    onClick={() => remove(stock.symbol)}
                    aria-label={`Remove ${stock.symbol}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
        </div>
      )}
    </div>
  );
}
