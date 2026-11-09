import type { ComponentPropsWithRef, ReactNode } from "react";
import { Link, type LinkProps } from "react-router";
import { cn } from "@/lib/cn";

type Variant = "primary" | "outline" | "ghost";
type Size = "md" | "lg";

interface StyleProps {
  variant?: Variant;
  size?: Size;
  block?: boolean;
}

const base =
  "relative inline-flex select-none items-center justify-center gap-3 font-medium transition-[background-color,color,border-color,opacity] duration-300 ease-editorial disabled:cursor-not-allowed disabled:opacity-45";

const variants: Record<Variant, string> = {
  primary: "bg-ink text-paper hover:bg-ink-soft",
  outline: "border border-ink text-ink hover:bg-ink hover:text-paper",
  ghost: "text-ink hover:text-clay",
};

const sizes: Record<Size, string> = {
  md: "h-11 px-6 text-sm",
  lg: "h-14 px-8 text-[0.9375rem]",
};

function buttonClasses({ variant = "primary", size = "md", block }: StyleProps = {}) {
  return cn(base, variants[variant], sizes[size], block && "w-full");
}

type ButtonProps = ComponentPropsWithRef<"button"> & StyleProps;

export function Button({ variant, size, block, className, type = "button", ...rest }: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(buttonClasses({ variant, size, block }), className)}
      {...rest}
    />
  );
}

type ButtonLinkProps = LinkProps & StyleProps;

export function ButtonLink({ variant, size, block, className, ...rest }: ButtonLinkProps) {
  return <Link className={cn(buttonClasses({ variant, size, block }), className)} {...rest} />;
}

interface IconButtonProps extends ComponentPropsWithRef<"button"> {
  label: string;
  children: ReactNode;
}

/** Square, label-required button for icon-only actions. */
export function IconButton({
  label,
  className,
  children,
  type = "button",
  ...rest
}: IconButtonProps) {
  return (
    <button
      type={type}
      aria-label={label}
      title={label}
      className={cn(
        "relative inline-flex size-11 items-center justify-center text-ink transition-colors duration-300 hover:text-clay",
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  );
}
