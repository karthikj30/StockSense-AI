"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { MiniSparkline } from "@/components/charts/MiniSparkline";
import {
  formatIndianNumber,
  formatPercent,
} from "@/lib/utils/formatters";
import { cn } from "@/lib/utils";

export interface MarketIndex {
  symbol: string;
  name: string;
  value: number;
  change: number;
  changePercent: number;
  sparkline?: number[];
}

interface MarketOverviewProps {
  indices: MarketIndex[];
  loading?: boolean;
}

export function MarketOverview({ indices, loading }: MarketOverviewProps) {
  if (loading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-28 rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
      {indices.map((index) => {
        const isUp = index.changePercent >= 0;

        return (
          <Card key={index.symbol} className="card-glow overflow-hidden">
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="truncate text-xs font-medium text-muted">
                    {index.name}
                  </p>
                  <p className="mt-1 font-display text-lg font-semibold text-foreground">
                    {formatIndianNumber(index.value)}
                  </p>
                  <p
                    className={cn(
                      "mt-0.5 text-xs font-medium",
                      isUp ? "text-stock-up" : "text-stock-down"
                    )}
                  >
                    {formatPercent(index.changePercent)}
                  </p>
                </div>
                <MiniSparkline
                  data={index.sparkline ?? []}
                  width={72}
                  height={36}
                  positive={isUp}
                />
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
