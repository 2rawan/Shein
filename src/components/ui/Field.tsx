import { useId, type ComponentPropsWithRef, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Icon } from "./Icon";

interface FieldShellProps {
  id: string;
  label: string;
  error?: string | undefined;
  hint?: string | undefined;
  optionalLabel?: string | undefined;
  className?: string | undefined;
  children: ReactNode;
}

function FieldShell({
  id,
  label,
  error,
  hint,
  optionalLabel,
  className,
  children,
}: FieldShellProps) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <label htmlFor={id} className="flex items-baseline justify-between text-sm text-ink-soft">
        <span>{label}</span>
        {optionalLabel && <span className="text-xs text-stone">{optionalLabel}</span>}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} className="text-[0.8125rem] text-danger">
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="text-[0.8125rem] text-stone">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

const control = (invalid: boolean) =>
  cn(
    "h-12 w-full border bg-white px-4 text-[0.9375rem] text-ink transition-colors duration-200 placeholder:text-stone/70 focus:border-ink focus:outline-none",
    invalid ? "border-danger" : "border-line hover:border-stone",
  );

const describedBy = (id: string, error?: string, hint?: string) =>
  error ? `${id}-error` : hint ? `${id}-hint` : undefined;

type TextFieldProps = Omit<ComponentPropsWithRef<"input">, "id"> & {
  label: string;
  error?: string | undefined;
  hint?: string | undefined;
  optionalLabel?: string | undefined;
  wrapperClassName?: string;
};

export function TextField({
  label,
  error,
  hint,
  optionalLabel,
  wrapperClassName,
  className,
  ...rest
}: TextFieldProps) {
  const id = useId();
  return (
    <FieldShell
      id={id}
      label={label}
      error={error}
      hint={hint}
      optionalLabel={optionalLabel}
      className={wrapperClassName}
    >
      <input
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, error, hint)}
        className={cn(control(Boolean(error)), className)}
        {...rest}
      />
    </FieldShell>
  );
}

type SelectFieldProps = Omit<ComponentPropsWithRef<"select">, "id"> & {
  label: string;
  error?: string | undefined;
  options: { value: string; label: string }[];
  wrapperClassName?: string;
};

export function SelectField({
  label,
  error,
  options,
  wrapperClassName,
  className,
  ...rest
}: SelectFieldProps) {
  const id = useId();
  return (
    <FieldShell id={id} label={label} error={error} className={wrapperClassName}>
      <div className="relative">
        <select
          id={id}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy(id, error)}
          className={cn(control(Boolean(error)), "appearance-none pe-10", className)}
          {...rest}
        >
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <Icon
          name="chevronDown"
          size={16}
          className="pointer-events-none absolute end-4 top-1/2 -translate-y-1/2 text-stone"
        />
      </div>
    </FieldShell>
  );
}
