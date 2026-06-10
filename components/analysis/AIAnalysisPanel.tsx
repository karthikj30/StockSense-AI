"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Loader2, Sparkles } from "lucide-react";

import {
  ConfidenceScore,
  parseConfidence,
} from "@/components/analysis/ConfidenceScore";
import {
  parseRecommendation,
  RecommendationBadge,
} from "@/components/analysis/RecommendationBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface AIAnalysisPanelProps {
  symbol: string;
  initialAnalysis?: string;
}

export function AIAnalysisPanel({
  symbol,
  initialAnalysis,
}: AIAnalysisPanelProps) {
  const [analysis, setAnalysis] = useState(initialAnalysis ?? "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function runAnalysis() {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(
        `/api/stocks/${encodeURIComponent(symbol)}/analyze`,
        { method: "POST", headers: { "Content-Type": "application/json" } }
      );

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Analysis failed");
      }

      const data = await res.json();
      setAnalysis(data.analysis);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Analysis failed");
    } finally {
      setLoading(false);
    }
  }

  const recommendation = analysis ? parseRecommendation(analysis) : null;
  const confidence = analysis ? parseConfidence(analysis) : null;

  return (
    <Card className="border-ai-accent/20">
      <CardHeader className="flex flex-row items-start justify-between gap-4">
        <div>
          <CardTitle className="flex items-center gap-2 font-display text-lg">
            <Sparkles className="h-5 w-5 text-ai-accent" />
            AI Analysis
          </CardTitle>
          <p className="mt-1 text-sm text-muted">
            Beginner-friendly breakdown powered by StockSense AI
          </p>
        </div>
        <div className="flex items-center gap-3">
          {recommendation && (
            <RecommendationBadge recommendation={recommendation} />
          )}
          {confidence !== null && <ConfidenceScore score={confidence} />}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {!analysis && !loading && (
          <div className="rounded-lg border border-dashed border-surface2 py-10 text-center">
            <Sparkles className="mx-auto mb-3 h-8 w-8 text-ai-accent/60" />
            <p className="text-sm text-muted">
              Get a full AI breakdown with entry zones, stop-loss, and risks
            </p>
            <Button className="mt-4" onClick={runAnalysis} disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="animate-spin" />
                  Analyzing…
                </>
              ) : (
                "Run AI Analysis"
              )}
            </Button>
          </div>
        )}

        {loading && (
          <div className="flex items-center justify-center gap-2 py-12 text-sm text-muted">
            <Loader2 className="h-5 w-5 animate-spin text-ai-accent" />
            Analyzing {symbol.replace(".NS", "")}…
          </div>
        )}

        {error && (
          <div className="rounded-lg border border-stock-down/30 bg-stock-down/10 p-4 text-sm text-stock-down">
            {error}
            <Button
              variant="outline"
              size="sm"
              className="mt-3"
              onClick={runAnalysis}
            >
              Retry
            </Button>
          </div>
        )}

        {analysis && !loading && (
          <>
            <div className="prose prose-invert prose-sm max-w-none prose-headings:font-display prose-headings:text-foreground prose-p:text-muted prose-strong:text-foreground prose-li:text-muted">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {analysis}
              </ReactMarkdown>
            </div>
            <Button variant="outline" size="sm" onClick={runAnalysis}>
              Refresh Analysis
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}
