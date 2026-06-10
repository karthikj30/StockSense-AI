"use client";

import { formatVolume } from "@/lib/utils/formatters";
import { cn } from "@/lib/utils";

interface VolumeBarProps {
  volume: number;
  maxVolume: number;
  isUp?: boolean;
  className?: string;
}

export function VolumeBar({
  volume,
  maxVolume,
  isUp = true,
  className,
}: VolumeBarProps) {
  const pct = maxVolume > 0 ? Math.min(100, (volume / maxVolume) * 100) : 0;

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface2">
        <div
          className={cn(
            "h-full rounded-full transition-all",
            isUp ? "bg-stock-up/70" : "bg-stock-down/70"
          )}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="shrink-0 text-xs tabular-nums text-muted">
        {formatVolume(volume)}
      </span>
    </div>
  );
}
