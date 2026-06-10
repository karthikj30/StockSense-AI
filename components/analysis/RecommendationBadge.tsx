import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export type Recommendation = "BUY" | "SELL" | "HOLD";

interface RecommendationBadgeProps {
  recommendation: Recommendation;
  className?: string;
}

const config: Record<
  Recommendation,
  { label: string; variant: "success" | "danger" | "secondary" }
> = {
  BUY: { label: "BUY", variant: "success" },
  SELL: { label: "SELL", variant: "danger" },
  HOLD: { label: "HOLD", variant: "secondary" },
};

export function RecommendationBadge({
  recommendation,
  className,
}: RecommendationBadgeProps) {
  const { label, variant } = config[recommendation];

  return (
    <Badge variant={variant} className={cn("text-sm px-3 py-1", className)}>
      {label}
    </Badge>
  );
}

export function parseRecommendation(text: string): Recommendation | null {
  const buyMatch = text.match(/\b(BUY)\b/i);
  const sellMatch = text.match(/\b(SELL)\b/i);
  const holdMatch = text.match(/\b(HOLD)\b/i);

  const recLine = text.match(/recommendation[:\s*]*\**\s*(BUY|SELL|HOLD)/i);
  if (recLine) return recLine[1].toUpperCase() as Recommendation;

  if (buyMatch && !sellMatch) return "BUY";
  if (sellMatch && !buyMatch) return "SELL";
  if (holdMatch) return "HOLD";

  return null;
}
