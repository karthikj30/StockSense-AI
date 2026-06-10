"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  formatIndianCurrency,
  formatPercent,
} from "@/lib/utils/formatters";
import { cn } from "@/lib/utils";

export interface TechnicalData {
  symbol?: string;
  currentPrice?: number;
  rsi?: number;
  macd?: number;
  macdSignal?: number;
  macdHistogram?: number;
  bbHigh?: number;
  bbLow?: number;
  bbMid?: number;
  ema20?: number;
  ema50?: number;
  ema200?: number;
  trend?: string;
  adx?: number;
}

interface TechnicalIndicatorsProps {
  data: TechnicalData | null;
  loading?: boolean;
}

function IndicatorCard({
  title,
  value,
  hint,
  status,
}: {
  title: string;
  value: string;
  hint: string;
  status?: "bullish" | "bearish" | "neutral";
}) {
  return (
    <div className="rounded-lg border border-surface2 bg-surface2/30 p-3">
      <p className="text-xs font-medium text-muted">{title}</p>
      <p
        className={cn(
          "mt-1 font-display text-lg font-semibold",
          status === "bullish" && "text-stock-up",
          status === "bearish" && "text-stock-down",
          status === "neutral" && "text-foreground"
        )}
      >
        {value}
      </p>
      <p className="mt-1 text-[11px] leading-snug text-muted">{hint}</p>
    </div>
  );
}

function getRsiStatus(rsi: number): {
  status: "bullish" | "bearish" | "neutral";
  hint: string;
} {
  if (rsi > 70)
    return {
      status: "bearish",
      hint: "Above 70 = overbought. Price may cool off — like a batsman who scored too fast.",
    };
  if (rsi < 30)
    return {
      status: "bullish",
      hint: "Below 30 = oversold. Could be a buying opportunity if fundamentals are strong.",
    };
  return {
    status: "neutral",
    hint: "Between 30–70 = neutral zone. No extreme signal right now.",
  };
}

function getMacdStatus(
  macd: number,
  signal: number
): { status: "bullish" | "bearish" | "neutral"; hint: string } {
  if (macd > signal)
    return {
      status: "bullish",
      hint: "MACD above signal line = bullish momentum building.",
    };
  if (macd < signal)
    return {
      status: "bearish",
      hint: "MACD below signal line = bearish momentum. Sellers may be in control.",
    };
  return {
    status: "neutral",
    hint: "MACD and signal are close — momentum is unclear.",
  };
}

export function TechnicalIndicators({ data, loading }: TechnicalIndicatorsProps) {
  if (loading || !data) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="font-display text-lg">
            Technical Indicators
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-24 animate-pulse rounded-lg bg-surface2"
              />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const rsi = data.rsi ?? 50;
  const rsiInfo = getRsiStatus(rsi);
  const macdInfo = getMacdStatus(data.macd ?? 0, data.macdSignal ?? 0);

  const price = data.currentPrice ?? 0;
  const bbPosition =
    data.bbHigh && data.bbLow
      ? ((price - data.bbLow) / (data.bbHigh - data.bbLow)) * 100
      : 50;

  const bbHint =
    bbPosition > 80
      ? "Price near upper band — may be stretched. Watch for pullback."
      : bbPosition < 20
        ? "Price near lower band — could bounce if support holds."
        : "Price is within normal range of the Bollinger Bands.";

  const emaHint =
    price > (data.ema50 ?? 0)
      ? "Price above EMA 50 = short-term uptrend. Bulls have the edge."
      : "Price below EMA 50 = short-term weakness. Wait for confirmation.";

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-display text-lg">
          Technical Indicators
        </CardTitle>
        <p className="text-sm text-muted">
          Key signals explained for beginners — trend:{" "}
          <span className="font-medium text-foreground">
            {data.trend ?? "N/A"}
          </span>
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 sm:grid-cols-2">
          <IndicatorCard
            title="RSI (14)"
            value={rsi.toFixed(1)}
            hint={rsiInfo.hint}
            status={rsiInfo.status}
          />
          <IndicatorCard
            title="MACD"
            value={`${(data.macd ?? 0).toFixed(2)} / ${(data.macdSignal ?? 0).toFixed(2)}`}
            hint={macdInfo.hint}
            status={macdInfo.status}
          />
          <IndicatorCard
            title="Bollinger Bands"
            value={`${formatIndianCurrency(data.bbLow ?? 0)} – ${formatIndianCurrency(data.bbHigh ?? 0)}`}
            hint={bbHint}
            status={
              bbPosition > 80
                ? "bearish"
                : bbPosition < 20
                  ? "bullish"
                  : "neutral"
            }
          />
          <IndicatorCard
            title="EMA 20 / 50 / 200"
            value={`${formatIndianCurrency(data.ema20 ?? 0)} / ${formatIndianCurrency(data.ema50 ?? 0)}`}
            hint={emaHint}
            status={price > (data.ema50 ?? 0) ? "bullish" : "bearish"}
          />
        </div>
        {data.adx !== undefined && (
          <p className="mt-4 text-xs text-muted">
            ADX {data.adx.toFixed(1)} —{" "}
            {data.adx > 25
              ? "Strong trend in play"
              : "Weak trend — price may chop sideways"}
            . Change vs 52W range:{" "}
            {formatPercent(((price / (data.bbMid || price)) - 1) * 100)}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
