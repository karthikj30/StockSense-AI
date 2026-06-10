"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatPercent } from "@/lib/utils/formatters";
import { cn } from "@/lib/utils";

export interface SectorData {
  sector: string;
  changePercent: number;
  stocks: number;
}

interface SectorHeatmapProps {
  sectors: SectorData[];
  loading?: boolean;
}

function getHeatColor(changePercent: number): string {
  if (changePercent >= 2) return "bg-stock-up/80 border-stock-up";
  if (changePercent >= 0.5) return "bg-stock-up/50 border-stock-up/60";
  if (changePercent >= 0) return "bg-stock-up/25 border-stock-up/40";
  if (changePercent >= -0.5) return "bg-stock-down/25 border-stock-down/40";
  if (changePercent >= -2) return "bg-stock-down/50 border-stock-down/60";
  return "bg-stock-down/80 border-stock-down";
}

export function SectorHeatmap({ sectors, loading }: SectorHeatmapProps) {
  if (loading) {
    return <Skeleton className="h-64 rounded-xl" />;
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="font-display text-lg">Sector Heatmap</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {sectors.map((sector) => (
            <div
              key={sector.sector}
              className={cn(
                "flex min-h-[88px] flex-col justify-between rounded-xl border p-3 transition-transform hover:scale-[1.02]",
                getHeatColor(sector.changePercent)
              )}
            >
              <p className="font-display text-sm font-semibold text-foreground">
                {sector.sector}
              </p>
              <div>
                <p
                  className={cn(
                    "text-lg font-bold",
                    sector.changePercent >= 0
                      ? "text-stock-up"
                      : "text-stock-down"
                  )}
                >
                  {formatPercent(sector.changePercent)}
                </p>
                <p className="text-[10px] text-muted">
                  {sector.stocks} stocks tracked
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
