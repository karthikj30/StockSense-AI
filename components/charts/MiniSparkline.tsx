"use client";

import { cn } from "@/lib/utils";

interface MiniSparklineProps {
  data: number[];
  width?: number;
  height?: number;
  className?: string;
  positive?: boolean;
  strokeWidth?: number;
}

export function MiniSparkline({
  data,
  width = 80,
  height = 32,
  className,
  positive,
  strokeWidth = 1.5,
}: MiniSparklineProps) {
  if (!data.length) {
    return (
      <svg
        width={width}
        height={height}
        className={cn("text-muted", className)}
        aria-hidden
      >
        <line
          x1={0}
          y1={height / 2}
          x2={width}
          y2={height / 2}
          stroke="currentColor"
          strokeWidth={1}
          strokeDasharray="4 4"
          opacity={0.4}
        />
      </svg>
    );
  }

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const padding = 2;

  const points = data.map((value, index) => {
    const x = (index / (data.length - 1 || 1)) * width;
    const y =
      height - padding - ((value - min) / range) * (height - padding * 2);
    return `${x},${y}`;
  });

  const isUp =
    positive ?? data[data.length - 1] >= data[0];
  const strokeColor = isUp ? "#22C55E" : "#EF4444";
  const fillId = `spark-fill-${isUp ? "up" : "down"}-${width}`;

  const areaPath = `M 0,${height} L ${points.join(" L ")} L ${width},${height} Z`;
  const linePath = `M ${points.join(" L ")}`;

  return (
    <svg
      width={width}
      height={height}
      className={cn("overflow-visible", className)}
      aria-hidden
    >
      <defs>
        <linearGradient id={fillId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={strokeColor} stopOpacity={0.25} />
          <stop offset="100%" stopColor={strokeColor} stopOpacity={0} />
        </linearGradient>
      </defs>
      <path d={areaPath} fill={`url(#${fillId})`} />
      <path
        d={linePath}
        fill="none"
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
