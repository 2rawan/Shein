import { useId, useState, type ComponentPropsWithRef, type ReactNode } from "react";
import { useI18n } from "@/i18n";
import { cn } from "@/lib/cn";
import { passwordStrength } from "@/lib/validation";
import { TextField } from "./Field";
import { Icon } from "./Icon";

type PasswordFieldProps = Omit<ComponentPropsWithRef<"input">, "id" | "type"> & {
  label: string;
  error?: string | undefined;
  hint?: string | undefined;
  aside?: ReactNode;
  /** Show the 4-step strength meter (sign-up and reset forms). */
  meter?: boolean;
  wrapperClassName?: string;
};

export function PasswordField({ meter, value, ...rest }: PasswordFieldProps) {
  const { t } = useI18n();
  const [visible, setVisible] = useState(false);
  const strength = passwordStrength(typeof value === "string" ? value : "");

  return (
    <div className="flex flex-col gap-2">
      <TextField
        {...rest}
        value={value}
        type={visible ? "text" : "password"}
        dir="ltr"
        trailing={
          <button
            type="button"
            onClick={() => {
              setVisible((v) => !v);
            }}
            aria-label={visible ? t.auth.hidePassword : t.auth.showPassword}
            aria-pressed={visible}
            className="inline-flex size-12 items-center justify-center text-stone transition-colors hover:text-ink"
          >
            <Icon name={visible ? "eyeOff" : "eye"} size={18} />
          </button>
        }
      />
      {meter && (
        <div className="flex items-center gap-3" aria-live="polite">
          <div className="grid flex-1 grid-cols-4 gap-1" aria-hidden="true">
            {[1, 2, 3, 4].map((step) => (
              <span
                key={step}
                className={cn(
                  "h-0.5 transition-colors duration-300",
                  strength >= step
                    ? strength <= 1
                      ? "bg-danger"
                      : strength <= 2
                        ? "bg-clay"
                        : "bg-moss"
                    : "bg-line",
                )}
              />
            ))}
          </div>
          <span className="w-16 text-end text-xs text-stone">
            {strength > 0 && t.auth.strength[strength - 1]}
          </span>
        </div>
      )}
    </div>
  );
}

type CheckboxFieldProps = Omit<ComponentPropsWithRef<"input">, "id" | "type"> & {
  children: ReactNode;
  error?: string | undefined;
};

export function CheckboxField({ children, error, className, ...rest }: CheckboxFieldProps) {
  const id = useId();
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <label
        htmlFor={id}
        className="group flex cursor-pointer items-start gap-3 text-sm text-ink-soft"
      >
        <input
          id={id}
          type="checkbox"
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          className="peer sr-only"
          {...rest}
        />
        <span
          aria-hidden="true"
          className={cn(
            "mt-0.5 flex size-4 shrink-0 items-center justify-center border transition-colors peer-checked:border-ink peer-checked:bg-ink peer-checked:text-paper peer-focus-visible:outline peer-focus-visible:outline-1 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ink [&>svg]:opacity-0 peer-checked:[&>svg]:opacity-100",
            error ? "border-danger" : "border-stone",
          )}
        >
          <Icon name="check" size={12} strokeWidth={2} />
        </span>
        <span>{children}</span>
      </label>
      {error && (
        <p id={`${id}-error`} className="text-[0.8125rem] text-danger">
          {error}
        </p>
      )}
    </div>
  );
}

/** Banner for form-level errors (wrong password) or the "fix N fields" summary. */
export function FormAlert({
  tone = "error",
  children,
}: {
  tone?: "error" | "info" | "success";
  children: ReactNode;
}) {
  return (
    <div
      role={tone === "error" ? "alert" : "status"}
      className={cn(
        "border-s-2 bg-white px-5 py-4 text-sm",
        tone === "error" && "border-danger text-danger",
        tone === "info" && "border-clay text-ink",
        tone === "success" && "border-moss text-ink",
      )}
    >
      {children}
    </div>
  );
}
