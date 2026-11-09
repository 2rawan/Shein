import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

interface SectionHeadingProps {
  eyebrow?: string;
  title: ReactNode;
  as?: "h1" | "h2";
  size?: "md" | "lg";
  className?: string;
  children?: ReactNode;
}

/** Editorial heading: small-caps eyebrow over a display-serif title. */
export function SectionHeading({
  eyebrow,
  title,
  as: Tag = "h2",
  size = "md",
  className,
  children,
}: SectionHeadingProps) {
  return (
    <div className={cn("flex flex-col gap-4", className)}>
      {eyebrow && <p className="label text-stone">{eyebrow}</p>}
      <Tag
        className={cn(
          "font-display font-normal tracking-tightest text-balance",
          size === "lg" ? "text-display" : "text-display-sm",
        )}
      >
        {title}
      </Tag>
      {children}
    </div>
  );
}

interface EmptyStateProps {
  title: string;
  body: string;
  action?: ReactNode;
}

export function EmptyState({ title, body, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-start gap-5 py-16 md:py-24">
      <p className="font-display text-display-sm text-balance italic">{title}</p>
      <p className="max-w-md text-ink-soft">{body}</p>
      {action}
    </div>
  );
}

export function Rating({ value, label }: { value: number; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-sm" role="img" aria-label={label}>
      <svg viewBox="0 0 24 24" width={14} height={14} aria-hidden="true" className="text-ink">
        <path
          fill="currentColor"
          d="m12 3.5 2.6 5.4 5.9.8-4.3 4.1 1.1 5.8L12 16.8l-5.3 2.8 1.1-5.8-4.3-4.1 5.9-.8z"
        />
      </svg>
      <span className="tabular-nums">{value.toFixed(1)}</span>
    </span>
  );
}
