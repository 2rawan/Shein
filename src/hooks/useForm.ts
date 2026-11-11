import { useState, type ChangeEvent } from "react";
import { useI18n } from "@/i18n";
import type { ValidationError } from "@/lib/validation";

/** A field rule may inspect sibling values (e.g. "confirm password"). */
export type Rule<K extends string> = (
  value: string,
  values: Record<K, string>,
) => ValidationError | null;

interface FormOptions<K extends string> {
  rules: Record<K, Rule<K>>;
  initial: Record<K, string>;
  /** Input masks applied as the user types (card number, expiry…). */
  format?: Partial<Record<K, (raw: string) => string>>;
}

type Errors<K extends string> = Partial<Record<K, ValidationError>>;

function setError<K extends string>(
  errors: Errors<K>,
  name: K,
  error: ValidationError | null,
): Errors<K> {
  const rest = Object.fromEntries(
    Object.entries(errors).filter(([key]) => key !== name),
  ) as Errors<K>;
  return error ? { ...rest, [name]: error } : rest;
}

/**
 * Small form controller: validates on blur, re-validates live once a field
 * has been visited, and on submit validates everything and focuses the first
 * invalid field (in rule declaration order).
 */
export function useForm<K extends string>({ rules, initial, format }: FormOptions<K>) {
  const { t } = useI18n();
  const [values, setValues] = useState(initial);
  const [errors, setErrors] = useState<Errors<K>>({});
  const [touched, setTouched] = useState<Partial<Record<K, boolean>>>({});
  const [submitted, setSubmitted] = useState(false);
  const order = Object.keys(rules) as K[];

  const setValue = (name: K, raw: string) => {
    const formatter = format ? format[name] : undefined;
    const value = formatter ? formatter(raw) : raw;
    const next = { ...values, [name]: value };
    setValues(next);
    if (touched[name]) setErrors((e) => setError(e, name, rules[name](value, next)));
  };

  const field = (name: K) => ({
    name,
    value: values[name],
    error: errors[name] ? t.validation[errors[name]] : undefined,
    onChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setValue(name, e.target.value);
    },
    onBlur: () => {
      setTouched((prev) => ({ ...prev, [name]: true }));
      setErrors((e) => setError(e, name, rules[name](values[name], values)));
    },
  });

  /**
   * Validates every field; returns the values when valid, otherwise null and
   * moves focus to the first invalid control inside `formEl`.
   */
  const validate = (formEl?: HTMLFormElement): Record<K, string> | null => {
    let next: Errors<K> = {};
    for (const name of order) next = setError(next, name, rules[name](values[name], values));
    setErrors(next);
    setTouched(Object.fromEntries(order.map((n) => [n, true])) as Record<K, boolean>);
    setSubmitted(true);
    const firstInvalid = order.find((n) => next[n]);
    if (firstInvalid) {
      formEl?.querySelector<HTMLElement>(`[name="${firstInvalid}"]`)?.focus();
      return null;
    }
    return values;
  };

  return {
    values,
    setValue,
    field,
    validate,
    errorCount: Object.keys(errors).length,
    submitted,
  };
}
