import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { BUNDLED_RATES, fetchLiveRates, type RateTable } from "@/lib/currency";

const MAX_AGE_MS = 12 * 60 * 60 * 1000;

interface RatesState extends RateTable {
  fetchedAt: number;
  /** Refreshes from the provider when the cached table is stale; keeps the old table on failure. */
  refresh: () => Promise<void>;
}

export const useRates = create<RatesState>()(
  persist(
    (set, get) => ({
      ...BUNDLED_RATES,
      fetchedAt: 0,
      refresh: async () => {
        if (Date.now() - get().fetchedAt < MAX_AGE_MS) return;
        try {
          const live = await fetchLiveRates();
          set({ ...live, fetchedAt: Date.now() });
        } catch {
          // Offline or provider down: the bundled/cached table stays in use.
        }
      },
    }),
    {
      name: "nova:rates",
      version: 1,
      storage: createJSONStorage(() => localStorage),
      partialize: ({ rates, updatedAt, fetchedAt }) => ({ rates, updatedAt, fetchedAt }),
    },
  ),
);
