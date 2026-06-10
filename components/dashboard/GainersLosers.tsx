"use client";

import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  formatIndianCurrency,
  formatPercent,
} from "@/lib/utils/formatters";
import { cn } from "@/lib/utils";

export interface MoverStock {
  symbol: string;
  name: string;
  currentPrice: number;
  changePercent: number;
  sector?: string;
}

interface GainersLosersProps {
  gainers: MoverStock[];
  losers: MoverStock[];
  loading?: boolean;
}

function MoverTable({ stocks, type }: { stocks: MoverStock[]; type: "gain" | "loss" }) {
  if (!stocks.length) {
    return (
      <p className="py-8 text-center text-sm text-muted">
        No {type === "gain" ? "gainers" : "losers"} data available
      </p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-surface2 text-left text-xs text-muted">
            <th className="pb-3 pr-4 font-medium">Stock</th>
            <th className="pb-3 pr-4 font-medium">Price</th>
            <th className="pb-3 font-medium text-right">Change</th>
          </tr>
        </thead>
        <tbody>
          {stocks.map((stock) => {
            const slug = encodeURIComponent(stock.symbol);
            const isUp = stock.changePercent >= 0;

            return (
              <tr
                key={stock.symbol}
                className="border-b border-surface2/50 last:border-0"
              >
                <td className="py-3 pr-4">
                  <Link
                    href={`/stock/${slug}`}
                    className="group flex flex-col gap-0.5"
                  >
                    <span className="font-medium text-foreground group-hover:text-brand">
                      {stock.symbol.replace(".NS", "")}
                    </span>
                    <span className="max-w-[140px] truncate text-xs text-muted">
                      {stock.name}
                    </span>
                  </Link>
                </td>
                <td className="py-3 pr-4 text-foreground">
                  {formatIndianCurrency(stock.currentPrice)}
                </td>
                <td className="py-3 text-right">
                  <Badge variant={isUp ? "success" : "danger"}>
                    {formatPercent(stock.changePercent)}
                  </Badge>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export function GainersLosers({
  gainers,
  losers,
  loading,
}: GainersLosersProps) {
  if (loading) {
    return <Skeleton className="h-80 rounded-xl" />;
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="font-display text-lg">Top Movers</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="gainers">
          <TabsList className="mb-4 w-full">
            <TabsTrigger value="gainers" className="flex-1">
              <span className={cn("mr-1.5 inline-block h-2 w-2 rounded-full bg-stock-up")} />
              Gainers
            </TabsTrigger>
            <TabsTrigger value="losers" className="flex-1">
              <span className={cn("mr-1.5 inline-block h-2 w-2 rounded-full bg-stock-down")} />
              Losers
            </TabsTrigger>
          </TabsList>
          <TabsContent value="gainers">
            <MoverTable stocks={gainers} type="gain" />
          </TabsContent>
          <TabsContent value="losers">
            <MoverTable stocks={losers} type="loss" />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
