/** Only allow same-site relative paths, so `?redirect=` can't send users off-site. */
export function safeRedirect(target: string | null, fallback = "/account"): string {
  return target?.startsWith("/") && !target.startsWith("//") ? target : fallback;
}
