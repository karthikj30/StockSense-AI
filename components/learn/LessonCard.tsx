"use client";

import { BookOpen, Clock } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { Lesson } from "@/lib/data/lessons";
import { cn } from "@/lib/utils";

interface LessonCardProps {
  lesson: Lesson;
  completed?: boolean;
  onToggleComplete?: (lessonId: string) => void;
}

export function LessonCard({
  lesson,
  completed = false,
  onToggleComplete,
}: LessonCardProps) {
  return (
    <Card
      className={cn(
        "transition-colors",
        completed && "border-brand/30 bg-brand/5"
      )}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <Badge variant="secondary" className="text-[10px]">
                {lesson.moduleTitle}
              </Badge>
              <span className="flex items-center gap-1 text-[10px] text-muted">
                <Clock className="h-3 w-3" />
                {lesson.duration}
              </span>
            </div>
            <h3 className="font-display text-sm font-semibold text-foreground">
              {lesson.order}. {lesson.title}
            </h3>
            <p className="mt-1 text-xs leading-relaxed text-muted">
              {lesson.description}
            </p>
          </div>
          <BookOpen
            className={cn(
              "h-5 w-5 shrink-0",
              completed ? "text-brand" : "text-muted/50"
            )}
          />
        </div>
        {onToggleComplete && (
          <button
            type="button"
            onClick={() => onToggleComplete(lesson.id)}
            className={cn(
              "mt-3 text-xs font-medium transition-colors",
              completed
                ? "text-brand hover:text-brand/80"
                : "text-muted hover:text-foreground"
            )}
          >
            {completed ? "✓ Completed" : "Mark as complete"}
          </button>
        )}
      </CardContent>
    </Card>
  );
}
