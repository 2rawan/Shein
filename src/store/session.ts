import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { User } from "@/lib/auth";

const DAY_MS = 24 * 60 * 60 * 1000;

interface SessionState {
  user: User | null;
  expiresAt: number;
  start: (user: User, remember: boolean) => void;
  update: (user: User) => void;
  end: () => void;
}

export const useSession = create<SessionState>()(
  persist(
    (set) => ({
      user: null,
      expiresAt: 0,
      start: (user, remember) => {
        set({ user, expiresAt: Date.now() + (remember ? 30 : 1) * DAY_MS });
      },
      update: (user) => {
        set({ user });
      },
      end: () => {
        set({ user: null, expiresAt: 0 });
      },
    }),
    {
      name: "nova:session",
      version: 1,
      storage: createJSONStorage(() => localStorage),
      partialize: ({ user, expiresAt }) => ({ user, expiresAt }),
      onRehydrateStorage: () => (state) => {
        // Expired sessions are cleared when the app loads.
        if (state?.user && Date.now() > state.expiresAt) state.end();
      },
    },
  ),
);

export const useCurrentUser = () => useSession((s) => s.user);
