export type ValidationError =
  | "required"
  | "email"
  | "phone"
  | "postalCode"
  | "cardNumber"
  | "expiry"
  | "expired"
  | "cvc"
  | "minLength"
  | "password"
  | "passwordMatch"
  | "code"
  | "terms";

export type Validator = (value: string) => ValidationError | null;

export const required: Validator = (v) => (v.trim() ? null : "required");

export const minLength =
  (n: number): Validator =>
  (v) =>
    v.trim().length >= n ? null : "minLength";

export const email: Validator = (v) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? null : "email";

export const phone: Validator = (v) => {
  const digits = v.replace(/[\s()+-]/g, "");
  return /^\d{7,15}$/.test(digits) ? null : "phone";
};

export const postalCode: Validator = (v) =>
  /^[A-Za-z0-9][A-Za-z0-9 -]{2,9}$/.test(v.trim()) ? null : "postalCode";

export const digitsOnly = (v: string) => v.replace(/\D/g, "");

/** Luhn checksum, used by every major card network. */
export function luhn(num: string): boolean {
  let sum = 0;
  let double = false;
  for (let i = num.length - 1; i >= 0; i--) {
    let d = Number(num[i]);
    if (double) {
      d *= 2;
      if (d > 9) d -= 9;
    }
    sum += d;
    double = !double;
  }
  return sum % 10 === 0;
}

export const cardNumber: Validator = (v) => {
  const digits = digitsOnly(v);
  return digits.length >= 13 && digits.length <= 19 && luhn(digits) ? null : "cardNumber";
};

export const expiry =
  (now: Date = new Date()): Validator =>
  (v) => {
    const match = /^(\d{2})\s*\/\s*(\d{2})$/.exec(v.trim());
    if (!match) return "expiry";
    const month = Number(match[1]);
    const year = 2000 + Number(match[2]);
    if (month < 1 || month > 12) return "expiry";
    // Cards are valid through the last day of the expiry month.
    const endOfMonth = new Date(year, month, 0, 23, 59, 59);
    return endOfMonth >= now ? null : "expired";
  };

/** At least 8 characters with a letter and a digit. */
export const password: Validator = (v) =>
  v.length >= 8 && /[A-Za-z\u0600-\u06FF]/.test(v) && /\d/.test(v) ? null : "password";

export const resetCode: Validator = (v) => (/^\d{6}$/.test(v.trim()) ? null : "code");

/** Rough 0–4 score used only for the strength meter, never for acceptance. */
export function passwordStrength(v: string): number {
  if (!v) return 0;
  let score = 0;
  if (v.length >= 8) score++;
  if (v.length >= 12) score++;
  if (/[a-z]/.test(v) && /[A-Z]/.test(v)) score++;
  if (/\d/.test(v) && /[^A-Za-z0-9]/.test(v)) score++;
  return score;
}

export const cvc: Validator = (v) => (/^\d{3,4}$/.test(v.trim()) ? null : "cvc");

export const compose =
  (...validators: Validator[]): Validator =>
  (v) => {
    for (const validate of validators) {
      const error = validate(v);
      if (error) return error;
    }
    return null;
  };

export function formatCardNumber(v: string): string {
  return digitsOnly(v)
    .slice(0, 19)
    .replace(/(\d{4})(?=\d)/g, "$1 ");
}

export function formatExpiry(v: string): string {
  const d = digitsOnly(v).slice(0, 4);
  return d.length > 2 ? `${d.slice(0, 2)} / ${d.slice(2)}` : d;
}
