import { useState, type ReactNode } from "react";
import { Navigate, useLocation, useSearchParams } from "react-router";
import { safeRedirect } from "@/lib/navigation";
import { useCurrentUser } from "@/store/session";

/*
 * Both guards capture the URL on first render: during the page-exit animation
 * the outgoing route re-renders with the *new* location, and redirecting from
 * that would loop or send the user to the wrong place.
 */

/** Sends signed-out visitors to sign-in, then back to where they were going. */
export function RequireAuth({ children }: { children: ReactNode }) {
  const user = useCurrentUser();
  const location = useLocation();
  const [target] = useState(
    () => `/login?redirect=${encodeURIComponent(location.pathname + location.search)}`,
  );
  if (!user) return <Navigate to={target} replace />;
  return children;
}

/** Auth pages are pointless once signed in; forward to the intended page. */
export function GuestOnly({ children }: { children: ReactNode }) {
  const user = useCurrentUser();
  const [params] = useSearchParams();
  const [target] = useState(() => safeRedirect(params.get("redirect")));
  if (user) return <Navigate to={target} replace />;
  return children;
}
