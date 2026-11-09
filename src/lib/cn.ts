/** Joins truthy class names. Kept tiny on purpose; Tailwind classes here never conflict. */
export function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(" ");
}
