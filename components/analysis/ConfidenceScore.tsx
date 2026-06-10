import { cn } from "@/lib/utils";

interface ConfidenceScoreProps {
  score: number;
  max?: number;
  size?: number;
  className?: string;
}

export function ConfidenceScore({
  score,
  max = 10,
  size = 80,
  className,
}: ConfidenceScoreProps) {
  const clamped = Math.min(max, Math.max(0, score));
  const pct = (clamped / max) * 100;
  const radius = (size - 8) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (pct / 100) * circumference;

  const color =
    pct >= 70 ? "#22C55E" : pct >= 40 ? "#F59E0B" : "#EF4444";

  return (
    <div
      className={cn("relative inline-flex flex-col items-center", className)}
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#1F2937"
          strokeWidth={6}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={6}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-700"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display text-lg font-bold text-foreground">
          {clamped}
        </span>
        <span className="text-[10px] text-muted">/ {max}</span>
      </div>
    </div>
  );
}

export function parseConfidence(text: string): number | null {
  const patterns = [
    /confidence[:\s]*(\d+(?:\.\d+)?)\s*\/\s*10/i,
    /\((\d+(?:\.\d+)?)\s*\/\s*10\)/i,
    /confidence[:\s]*(\d+(?:\.\d+)?)\s*out of\s*10/i,
    /score[:\s]*(\d+(?:\.\d+)?)\s*\/\s*10/i,
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) return Math.round(parseFloat(match[1]));
  }

  return null;
}
