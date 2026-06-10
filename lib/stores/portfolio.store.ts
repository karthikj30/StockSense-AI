import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface PortfolioItem {
  id: string;
  symbol: string;
  buyPrice: number;
  quantity: number;
  buyDate: string;
}

interface PortfolioState {
  items: PortfolioItem[];
  add: (item: Omit<PortfolioItem, "id">) => void;
  remove: (id: string) => void;
  update: (id: string, updates: Partial<PortfolioItem>) => void;
}

export const usePortfolioStore = create<PortfolioState>()(
  persist(
    (set) => ({
      items: [],
      add: (item) =>
        set((state) => ({
          items: [
            ...state.items,
            { ...item, id: crypto.randomUUID() },
          ],
        })),
      remove: (id) =>
        set((state) => ({
          items: state.items.filter((i) => i.id !== id),
        })),
      update: (id, updates) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.id === id ? { ...i, ...updates } : i
          ),
        })),
    }),
    { name: "stocksense-portfolio" }
  )
);
