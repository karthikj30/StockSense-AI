"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import { NSE_TOP_STOCKS } from "@/lib/data/nse-stocks";
import { getGreeting, normalizeSymbol } from "@/lib/utils/formatters";

export function Topbar() {
  const greeting = getGreeting();
  const router = useRouter();
  const { data: session } = useSession();
  const [query, setQuery] = useState("");
  const [showResults, setShowResults] = useState(false);

  const results = query.trim()
    ? NSE_TOP_STOCKS.filter(
        (s) =>
          s.name.toLowerCase().includes(query.toLowerCase()) ||
          s.symbol.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 6)
    : [];

  function goToStock(symbol: string) {
    setQuery("");
    setShowResults(false);
    router.push(`/stocks/${encodeURIComponent(symbol)}`);
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (results[0]) {
      goToStock(results[0].symbol);
    } else if (query.trim()) {
      goToStock(normalizeSymbol(query.trim()));
    }
  }

  const initial = session?.user?.name?.[0] || session?.user?.email?.[0] || "U";

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-surface2 bg-background/80 px-4 backdrop-blur-md lg:px-6">
      <div className="flex flex-1 flex-col gap-0.5 pl-12 lg:pl-0">
        <p className="font-display text-sm font-semibold text-foreground">
          {greeting}
          {session?.user?.name ? `, ${session.user.name.split(" ")[0]}` : ""}
        </p>
        <p className="text-xs text-muted">
          Here&apos;s what&apos;s happening in Indian markets today
        </p>
      </div>

      <form
        onSubmit={handleSearch}
        className="relative hidden max-w-sm flex-1 sm:block"
      >
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
        <Input
          type="search"
          placeholder="Search NSE stocks..."
          className="pl-9"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setShowResults(true);
          }}
          onFocus={() => setShowResults(true)}
          onBlur={() => setTimeout(() => setShowResults(false), 150)}
        />
        {showResults && results.length > 0 && (
          <div className="absolute top-full z-50 mt-1 w-full rounded-lg border border-surface2 bg-surface py-1 shadow-xl">
            {results.map((stock) => (
              <button
                key={stock.symbol}
                type="button"
                className="flex w-full items-center justify-between px-3 py-2 text-left text-sm hover:bg-surface2"
                onMouseDown={() => goToStock(stock.symbol)}
              >
                <span className="font-medium text-foreground">{stock.name}</span>
                <span className="text-xs text-muted">{stock.symbol}</span>
              </button>
            ))}
          </div>
        )}
      </form>

      <div className="flex items-center gap-3">
        {session ? (
          <Link
            href="/login"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-brand to-ai-accent font-display text-sm font-bold text-background"
            title={session.user?.email || "Account"}
          >
            {initial.toUpperCase()}
          </Link>
        ) : (
          <Link
            href="/login"
            className="text-sm font-medium text-brand hover:underline"
          >
            Sign in
          </Link>
        )}
      </div>
    </header>
  );
}
