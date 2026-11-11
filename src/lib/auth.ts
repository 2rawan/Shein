/**
 * Client-side account service.
 *
 * The storefront has no backend, so accounts are kept in this browser's
 * localStorage. The API is async and error-coded like a network service so a
 * real auth provider can replace this module without touching the UI.
 * Passwords and reset codes are never stored in plain text (PBKDF2-SHA256).
 */

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  createdAt: string;
}

interface StoredReset {
  codeHash: string;
  salt: string;
  expiresAt: number;
  attempts: number;
}

interface Account extends User {
  passwordHash: string;
  salt: string;
  reset?: StoredReset | undefined;
}

export type AuthErrorCode =
  "emailTaken" | "invalidCredentials" | "resetInvalid" | "resetExpired" | "resetLocked";

export class AuthError extends Error {
  readonly code: AuthErrorCode;
  constructor(code: AuthErrorCode) {
    super(code);
    this.code = code;
  }
}

const ACCOUNTS_KEY = "nova:accounts";
const PBKDF2_ITERATIONS = 210_000;
const RESET_TTL_MS = 15 * 60 * 1000;
const RESET_MAX_ATTEMPTS = 5;

const encoder = new TextEncoder();
const toBase64 = (buf: ArrayBuffer | Uint8Array) =>
  btoa(String.fromCharCode(...new Uint8Array(buf)));
const randomSalt = () => toBase64(crypto.getRandomValues(new Uint8Array(16)));
const normalizeEmail = (email: string) => email.trim().toLowerCase();
/** Simulated network latency so loading states behave like production. */
const latency = () => new Promise((r) => setTimeout(r, 450));

async function hashSecret(secret: string, salt: string): Promise<string> {
  const key = await crypto.subtle.importKey("raw", encoder.encode(secret), "PBKDF2", false, [
    "deriveBits",
  ]);
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", hash: "SHA-256", salt: encoder.encode(salt), iterations: PBKDF2_ITERATIONS },
    key,
    256,
  );
  return toBase64(bits);
}

function readAccounts(): Account[] {
  try {
    const raw = localStorage.getItem(ACCOUNTS_KEY);
    return raw ? (JSON.parse(raw) as Account[]) : [];
  } catch {
    return [];
  }
}

function writeAccounts(accounts: Account[]) {
  localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
}

const toUser = ({ id, email, firstName, lastName, createdAt }: Account): User => ({
  id,
  email,
  firstName,
  lastName,
  createdAt,
});

export interface SignUpInput {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export async function signUp(input: SignUpInput): Promise<User> {
  await latency();
  const email = normalizeEmail(input.email);
  const accounts = readAccounts();
  if (accounts.some((a) => a.email === email)) throw new AuthError("emailTaken");
  const salt = randomSalt();
  const account: Account = {
    id: crypto.randomUUID(),
    email,
    firstName: input.firstName.trim(),
    lastName: input.lastName.trim(),
    createdAt: new Date().toISOString(),
    salt,
    passwordHash: await hashSecret(input.password, salt),
  };
  writeAccounts([...accounts, account]);
  return toUser(account);
}

export async function signIn(emailInput: string, password: string): Promise<User> {
  await latency();
  const account = readAccounts().find((a) => a.email === normalizeEmail(emailInput));
  // Same error for unknown email and wrong password, so accounts can't be probed.
  if (!account) throw new AuthError("invalidCredentials");
  if ((await hashSecret(password, account.salt)) !== account.passwordHash) {
    throw new AuthError("invalidCredentials");
  }
  return toUser(account);
}

/**
 * Starts a password reset. A real service would email the code; with no mail
 * server, the code is returned so the UI can show it in a demo inbox. Returns
 * null for unknown emails (the UI shows the same message either way).
 */
export async function requestPasswordReset(emailInput: string): Promise<string | null> {
  await latency();
  const email = normalizeEmail(emailInput);
  const accounts = readAccounts();
  const account = accounts.find((a) => a.email === email);
  if (!account) return null;
  const code = String((crypto.getRandomValues(new Uint32Array(1))[0] ?? 0) % 1_000_000).padStart(
    6,
    "0",
  );
  const salt = randomSalt();
  account.reset = {
    codeHash: await hashSecret(code, salt),
    salt,
    expiresAt: Date.now() + RESET_TTL_MS,
    attempts: 0,
  };
  writeAccounts(accounts);
  return code;
}

export async function resetPassword(
  emailInput: string,
  code: string,
  newPassword: string,
): Promise<void> {
  await latency();
  const accounts = readAccounts();
  const account = accounts.find((a) => a.email === normalizeEmail(emailInput));
  const reset = account?.reset;
  if (!account || !reset) throw new AuthError("resetInvalid");
  if (reset.attempts >= RESET_MAX_ATTEMPTS) throw new AuthError("resetLocked");
  if (Date.now() > reset.expiresAt) throw new AuthError("resetExpired");
  if ((await hashSecret(code.trim(), reset.salt)) !== reset.codeHash) {
    reset.attempts += 1;
    writeAccounts(accounts);
    throw new AuthError(reset.attempts >= RESET_MAX_ATTEMPTS ? "resetLocked" : "resetInvalid");
  }
  account.salt = randomSalt();
  account.passwordHash = await hashSecret(newPassword, account.salt);
  account.reset = undefined;
  writeAccounts(accounts);
}

export async function updateProfile(
  id: string,
  changes: Pick<User, "firstName" | "lastName">,
): Promise<User> {
  await latency();
  const accounts = readAccounts();
  const account = accounts.find((a) => a.id === id);
  if (!account) throw new AuthError("invalidCredentials");
  account.firstName = changes.firstName.trim();
  account.lastName = changes.lastName.trim();
  writeAccounts(accounts);
  return toUser(account);
}
