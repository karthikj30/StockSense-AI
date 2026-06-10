"use client";

import { useEffect, useMemo, useState } from "react";

import { DailyTipCard, type DailyTip } from "@/components/dashboard/DailyTipCard";
import { GlossaryItem } from "@/components/learn/GlossaryItem";
import { LessonCard } from "@/components/learn/LessonCard";
import { LessonProgress } from "@/components/learn/LessonProgress";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GLOSSARY } from "@/lib/data/glossary";
import { LESSONS } from "@/lib/data/lessons";

const PROGRESS_KEY = "stocksense-lesson-progress";

export default function LearnPage() {
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const [glossaryQuery, setGlossaryQuery] = useState("");
  const [tip, setTip] = useState<DailyTip | null>(null);
  const [tipLoading, setTipLoading] = useState(true);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(PROGRESS_KEY);
      if (saved) setCompleted(new Set(JSON.parse(saved) as string[]));
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    async function loadTip() {
      setTipLoading(true);
      try {
        const res = await fetch("/api/ai/daily-tip");
        if (res.ok) setTip(await res.json());
      } finally {
        setTipLoading(false);
      }
    }
    loadTip();
  }, []);

  const modules = useMemo(() => {
    const map = new Map<string, typeof LESSONS>();
    LESSONS.forEach((lesson) => {
      const list = map.get(lesson.moduleId) ?? [];
      list.push(lesson);
      map.set(lesson.moduleId, list);
    });
    return map;
  }, []);

  const filteredGlossary = useMemo(() => {
    const q = glossaryQuery.trim().toLowerCase();
    if (!q) return GLOSSARY;
    return GLOSSARY.filter(
      (g) =>
        g.term.toLowerCase().includes(q) ||
        g.definition.toLowerCase().includes(q)
    );
  }, [glossaryQuery]);

  function toggleComplete(lessonId: string) {
    setCompleted((prev) => {
      const next = new Set(prev);
      if (next.has(lessonId)) next.delete(lessonId);
      else next.add(lessonId);
      localStorage.setItem(PROGRESS_KEY, JSON.stringify([...next]));
      return next;
    });
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground">
          Learn
        </h1>
        <p className="mt-1 text-sm text-muted">
          Structured lessons, glossary, and daily AI tips for beginners
        </p>
      </div>

      <LessonProgress completed={completed.size} total={LESSONS.length} />

      <Tabs defaultValue="lessons">
        <TabsList>
          <TabsTrigger value="lessons">Lessons</TabsTrigger>
          <TabsTrigger value="glossary">Glossary</TabsTrigger>
          <TabsTrigger value="tip">Daily Tip</TabsTrigger>
        </TabsList>

        <TabsContent value="lessons" className="mt-6 space-y-8">
          {[...modules.entries()].map(([moduleId, lessons]) => (
            <section key={moduleId}>
              <h2 className="mb-4 font-display text-lg font-semibold text-foreground">
                {lessons[0]?.moduleTitle}
              </h2>
              <div className="grid gap-3 lg:grid-cols-2">
                {lessons
                  .sort((a, b) => a.order - b.order)
                  .map((lesson) => (
                    <LessonCard
                      key={lesson.id}
                      lesson={lesson}
                      completed={completed.has(lesson.id)}
                      onToggleComplete={toggleComplete}
                    />
                  ))}
              </div>
            </section>
          ))}
        </TabsContent>

        <TabsContent value="glossary" className="mt-6 space-y-4">
          <Input
            placeholder="Search terms…"
            value={glossaryQuery}
            onChange={(e) => setGlossaryQuery(e.target.value)}
            className="max-w-md"
          />
          <div className="space-y-2">
            {filteredGlossary.map((term) => (
              <GlossaryItem key={term.term} term={term} />
            ))}
          </div>
          {filteredGlossary.length === 0 && (
            <p className="py-8 text-center text-sm text-muted">
              No glossary terms match your search
            </p>
          )}
        </TabsContent>

        <TabsContent value="tip" className="mt-6 max-w-lg">
          <DailyTipCard tip={tip} loading={tipLoading} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
