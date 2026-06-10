import { create } from "zustand";
import { persist } from "zustand/middleware";

interface WatchlistState {
  symbols: string[];
  add: (symbol: string) => void;
  remove: (symbol: string) => void;
  has: (symbol: string) => boolean;
}

export const useWatchlistStore = create<WatchlistState>()(
  persist(
    (set, get) => ({
      symbols: [],
      add: (symbol) =>
        set((state) => ({
          symbols: state.symbols.includes(symbol)
            ? state.symbols
            : [...state.symbols, symbol],
        })),
      remove: (symbol) =>
        set((state) => ({
          symbols: state.symbols.filter((s) => s !== symbol),
        })),
      has: (symbol) => get().symbols.includes(symbol),
    }),
    { name: "stocksense-watchlist" }
  )
);
