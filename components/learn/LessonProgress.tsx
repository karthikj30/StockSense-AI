"use client";

import { Progress } from "@/components/ui/progress";

interface LessonProgressProps {
  completed: number;
  total: number;
}

export function LessonProgress({ completed, total }: LessonProgressProps) {
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="rounded-xl border border-surface2 bg-surface2/30 p-4">
      <div className="mb-2 flex items-center justify-between text-sm">
        <span className="font-medium text-foreground">Learning Progress</span>
        <span className="text-muted">
          {completed} / {total} lessons ({pct}%)
        </span>
      </div>
      <Progress value={pct} className="h-2" />
    </div>
  );
}
