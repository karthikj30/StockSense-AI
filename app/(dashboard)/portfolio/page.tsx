"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Briefcase, Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  usePortfolioStore,
  type PortfolioItem,
} from "@/lib/stores/portfolio.store";
import {
  formatIndianCurrency,
  formatPercent,
  normalizeSymbol,
} from "@/lib/utils/formatters";
import { cn } from "@/lib/utils";

interface LivePrice {
  symbol: string;
  currentPrice: number;
}

export default function PortfolioPage() {
  const { items, add, remove } = usePortfolioStore();
  const [prices, setPrices] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    symbol: "",
    buyPrice: "",
    quantity: "",
    buyDate: new Date().toISOString().slice(0, 10),
  });

  useEffect(() => {
    if (!items.length) return;

    async function loadPrices() {
      setLoading(true);
      try {
        const symbols = [...new Set(items.map((i) => i.symbol))];
        const res = await fetch(`/api/stocks?symbols=${symbols.join(",")}`);
        if (res.ok) {
          const data = (await res.json()) as LivePrice[];
          const map: Record<string, number> = {};
          data.forEach((s) => {
            map[s.symbol] = s.currentPrice;
          });
          setPrices(map);
        }
      } finally {
        setLoading(false);
      }
    }

    loadPrices();
  }, [items]);

  const summary = useMemo(() => {
    let invested = 0;
    let current = 0;

    items.forEach((item) => {
      const cost = item.buyPrice * item.quantity;
      invested += cost;
      const live = prices[item.symbol] ?? item.buyPrice;
      current += live * item.quantity;
    });

    const pnl = current - invested;
    const pnlPct = invested > 0 ? (pnl / invested) * 100 : 0;

    return { invested, current, pnl, pnlPct };
  }, [items, prices]);

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    const symbol = normalizeSymbol(form.symbol);
    const buyPrice = parseFloat(form.buyPrice);
    const quantity = parseFloat(form.quantity);

    if (!symbol || !buyPrice || !quantity) return;

    add({
      symbol,
      buyPrice,
      quantity,
      buyDate: form.buyDate,
    });

    setForm({
      symbol: "",
      buyPrice: "",
      quantity: "",
      buyDate: new Date().toISOString().slice(0, 10),
    });
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground">
          Portfolio
        </h1>
        <p className="mt-1 text-sm text-muted">
          Paper portfolio tracker — log your holdings and track P&amp;L
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-muted">Invested</p>
            <p className="mt-1 font-display text-xl font-bold text-foreground">
              {formatIndianCurrency(summary.invested)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-muted">Current Value</p>
            <p className="mt-1 font-display text-xl font-bold text-foreground">
              {loading ? "…" : formatIndianCurrency(summary.current)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-muted">Total P&amp;L</p>
            <p
              className={cn(
                "mt-1 font-display text-xl font-bold",
                summary.pnl >= 0 ? "text-stock-up" : "text-stock-down"
              )}
            >
              {formatIndianCurrency(summary.pnl)}{" "}
              <span className="text-sm">({formatPercent(summary.pnlPct)})</span>
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-display text-lg">
            <Plus className="h-4 w-4" />
            Add Holding
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleAdd}
            className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5"
          >
            <Input
              placeholder="Symbol (TCS)"
              value={form.symbol}
              onChange={(e) => setForm({ ...form, symbol: e.target.value })}
              required
            />
            <Input
              type="number"
              step="0.01"
              placeholder="Buy price"
              value={form.buyPrice}
              onChange={(e) => setForm({ ...form, buyPrice: e.target.value })}
              required
            />
            <Input
              type="number"
              step="1"
              placeholder="Quantity"
              value={form.quantity}
              onChange={(e) => setForm({ ...form, quantity: e.target.value })}
              required
            />
            <Input
              type="date"
              value={form.buyDate}
              onChange={(e) => setForm({ ...form, buyDate: e.target.value })}
            />
            <Button type="submit">Add</Button>
          </form>
        </CardContent>
      </Card>

      {!items.length ? (
        <div className="rounded-xl border border-dashed border-surface2 py-16 text-center">
          <Briefcase className="mx-auto mb-3 h-10 w-10 text-muted/40" />
          <p className="text-sm text-muted">No holdings yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <HoldingRow
              key={item.id}
              item={item}
              livePrice={prices[item.symbol]}
              loading={loading}
              onRemove={() => remove(item.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function HoldingRow({
  item,
  livePrice,
  loading,
  onRemove,
}: {
  item: PortfolioItem;
  livePrice?: number;
  loading: boolean;
  onRemove: () => void;
}) {
  const current = livePrice ?? item.buyPrice;
  const invested = item.buyPrice * item.quantity;
  const value = current * item.quantity;
  const pnl = value - invested;
  const pnlPct = invested > 0 ? (pnl / invested) * 100 : 0;
  const slug = encodeURIComponent(item.symbol);

  return (
    <Card>
      <CardContent className="flex flex-wrap items-center justify-between gap-4 p-4">
        <div>
          <Link
            href={`/stocks/${slug}`}
            className="font-display font-semibold text-foreground hover:text-brand"
          >
            {item.symbol.replace(".NS", "")}
          </Link>
          <p className="text-xs text-muted">
            {item.quantity} shares @ {formatIndianCurrency(item.buyPrice)} ·{" "}
            {item.buyDate}
          </p>
        </div>
        <div className="text-right">
          <p className="font-medium text-foreground">
            {loading ? (
              <Skeleton className="inline-block h-5 w-20" />
            ) : (
              formatIndianCurrency(value)
            )}
          </p>
          <p
            className={cn(
              "text-xs font-medium",
              pnl >= 0 ? "text-stock-up" : "text-stock-down"
            )}
          >
            {formatPercent(pnlPct)} ({formatIndianCurrency(pnl)})
          </p>
        </div>
        <Button variant="ghost" size="icon" onClick={onRemove}>
          <Trash2 className="h-4 w-4 text-muted hover:text-stock-down" />
        </Button>
      </CardContent>
    </Card>
  );
}
