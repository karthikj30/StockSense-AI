"use client";

import { Activity, TrendingDown, TrendingUp } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface MarketPulseProps {
  moodScore: number;
  avgChange: number;
  loading?: boolean;
}

function getMoodLabel(score: number): {
  label: string;
  description: string;
  icon: typeof TrendingUp;
  color: string;
} {
  if (score >= 70) {
    return {
      label: "Bullish",
      description: "Markets showing strong positive momentum",
      icon: TrendingUp,
      color: "text-stock-up",
    };
  }
  if (score >= 55) {
    return {
      label: "Cautiously Optimistic",
      description: "Slight upward bias with mixed signals",
      icon: TrendingUp,
      color: "text-brand",
    };
  }
  if (score >= 45) {
    return {
      label: "Neutral",
      description: "Markets are balanced — no clear direction",
      icon: Activity,
      color: "text-muted",
    };
  }
  if (score >= 30) {
    return {
      label: "Cautious",
      description: "Weakness emerging across sectors",
      icon: TrendingDown,
      color: "text-orange-400",
    };
  }
  return {
    label: "Bearish",
    description: "Broad market pressure — tread carefully",
    icon: TrendingDown,
    color: "text-stock-down",
  };
}

export function MarketPulse({
  moodScore,
  avgChange,
  loading,
}: MarketPulseProps) {
  if (loading) {
    return <Skeleton className="h-48 rounded-xl" />;
  }

  const mood = getMoodLabel(moodScore);
  const Icon = mood.icon;
  const clampedScore = Math.min(100, Math.max(0, moodScore));

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="font-display text-lg">Market Pulse</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4">
          <div
            className={cn(
              "flex h-14 w-14 items-center justify-center rounded-2xl bg-surface2",
              mood.color
            )}
          >
            <Icon className="h-7 w-7" />
          </div>
          <div>
            <p className={cn("font-display text-xl font-bold", mood.color)}>
              {mood.label}
            </p>
            <p className="text-sm text-muted">{mood.description}</p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-xs text-muted">
            <span>Bearish</span>
            <span className="font-medium text-foreground">
              Mood: {clampedScore}/100
            </span>
            <span>Bullish</span>
          </div>
          <Progress value={clampedScore} className="h-2" />
        </div>

        <p className="text-xs text-muted">
          Avg index change:{" "}
          <span
            className={cn(
              "font-medium",
              avgChange >= 0 ? "text-stock-up" : "text-stock-down"
            )}
          >
            {avgChange >= 0 ? "+" : ""}
            {avgChange.toFixed(2)}%
          </span>{" "}
          across major indices
        </p>
      </CardContent>
    </Card>
  );
}
