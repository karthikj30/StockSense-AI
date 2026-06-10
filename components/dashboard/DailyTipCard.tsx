"use client";

import { Sparkles } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export interface DailyTip {
  title: string;
  content: string;
  category: string;
  difficulty: string;
  emoji?: string;
}

interface DailyTipCardProps {
  tip: DailyTip | null;
  loading?: boolean;
}

export function DailyTipCard({ tip, loading }: DailyTipCardProps) {
  if (loading) {
    return <Skeleton className="h-48 rounded-xl" />;
  }

  if (!tip) return null;

  return (
    <Card className="relative overflow-hidden border-ai-accent/30">
      <div className="ai-gradient absolute inset-0 opacity-10" />
      <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-ai-accent/20 blur-2xl" />
      <div className="absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-brand/20 blur-2xl" />

      <CardContent className="relative p-6">
        <div className="mb-3 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-ai-accent/20">
              <Sparkles className="h-4 w-4 text-ai-accent" />
            </div>
            <span className="font-display text-sm font-semibold text-gradient-brand">
              AI Daily Tip
            </span>
          </div>
          <span className="text-2xl" aria-hidden>
            {tip.emoji ?? "💡"}
          </span>
        </div>

        <h3 className="font-display text-lg font-semibold text-foreground">
          {tip.title}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-muted">{tip.content}</p>

        <div className="mt-4 flex flex-wrap gap-2">
          <Badge variant="ai">{tip.category}</Badge>
          <Badge variant="outline">{tip.difficulty}</Badge>
        </div>
      </CardContent>
    </Card>
  );
}
