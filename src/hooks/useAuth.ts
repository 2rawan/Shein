import { useCallback } from "react";
import { useI18n } from "@/i18n";
import * as auth from "@/lib/auth";
import { useSession } from "@/store/session";
import { useUi } from "@/store/ui";

/** Auth service calls wired to the session store and screen-reader announcements. */
export function useAuth() {
  const { t } = useI18n();
  const start = useSession((s) => s.start);
  const update = useSession((s) => s.update);
  const end = useSession((s) => s.end);
  const announce = useUi((s) => s.announce);

  const errorMessage = useCallback(
    (error: unknown) =>
      error instanceof auth.AuthError ? t.auth.errors[error.code] : t.auth.errors.generic,
    [t],
  );

  return {
    errorMessage,
    signIn: async (email: string, password: string, remember: boolean) => {
      const user = await auth.signIn(email, password);
      start(user, remember);
      announce(t.auth.welcomeBack(user.firstName));
      return user;
    },
    signUp: async (input: auth.SignUpInput) => {
      const user = await auth.signUp(input);
      start(user, true);
      announce(t.auth.welcome(user.firstName));
      return user;
    },
    signOut: () => {
      end();
      announce(t.auth.signedOut);
    },
    updateProfile: async (id: string, changes: Parameters<typeof auth.updateProfile>[1]) => {
      const user = await auth.updateProfile(id, changes);
      update(user);
      return user;
    },
  };
}
