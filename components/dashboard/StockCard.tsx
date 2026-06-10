"use client";

import Link from "next/link";

import { MiniSparkline } from "@/components/charts/MiniSparkline";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  formatIndianCurrency,
  formatPercent,
} from "@/lib/utils/formatters";
import { cn } from "@/lib/utils";

export interface StockCardData {
  symbol: string;
  name: string;
  currentPrice: number;
  changePercent: number;
  sector?: string;
  sparkline?: number[];
}

interface StockCardProps {
  stock: StockCardData;
}

export function StockCard({ stock }: StockCardProps) {
  const isUp = stock.changePercent >= 0;
  const slug = encodeURIComponent(stock.symbol);

  return (
    <Link href={`/stocks/${slug}`}>
      <Card className="transition-colors hover:border-brand/40 hover:bg-surface2/50">
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <p className="truncate font-display text-sm font-semibold text-foreground">
                  {stock.symbol.replace(".NS", "").replace(".BO", "")}
                </p>
                {stock.sector && (
                  <Badge variant="secondary" className="shrink-0 text-[10px]">
                    {stock.sector}
                  </Badge>
                )}
              </div>
              <p className="mt-0.5 truncate text-xs text-muted">{stock.name}</p>
              <p className="mt-2 font-medium text-foreground">
                {formatIndianCurrency(stock.currentPrice)}
              </p>
              <p
                className={cn(
                  "text-xs font-medium",
                  isUp ? "text-stock-up" : "text-stock-down"
                )}
              >
                {formatPercent(stock.changePercent)}
              </p>
            </div>
            <MiniSparkline
              data={stock.sparkline ?? []}
              width={64}
              height={40}
              positive={isUp}
            />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
