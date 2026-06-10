"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

import type { GlossaryTerm } from "@/lib/data/glossary";
import { cn } from "@/lib/utils";

interface GlossaryItemProps {
  term: GlossaryTerm;
}

export function GlossaryItem({ term }: GlossaryItemProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-lg border border-surface2 bg-surface2/20">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left"
      >
        <span className="font-display text-sm font-semibold text-foreground">
          {term.term}
        </span>
        <ChevronDown
          className={cn(
            "h-4 w-4 shrink-0 text-muted transition-transform",
            open && "rotate-180"
          )}
        />
      </button>
      {open && (
        <div className="border-t border-surface2 px-4 py-3">
          <p className="text-sm leading-relaxed text-muted">{term.definition}</p>
        </div>
      )}
    </div>
  );
}
