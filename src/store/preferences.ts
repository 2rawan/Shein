import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { Locale } from "@/lib/types";

interface PreferencesState {
  locale: Locale;
  setLocale: (locale: Locale) => void;
}

/** Storage key is also read by the inline script in index.html. */
export const usePreferences = create<PreferencesState>()(
  persist(
    (set) => ({
      locale: "en",
      setLocale: (locale) => {
        set({ locale });
      },
    }),
    {
      name: "nova:preferences",
      version: 1,
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
