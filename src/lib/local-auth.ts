import { CURRENCIES, type Currency } from "@/lib/constants";
import type { Profile, Wallet } from "@/lib/types/database";

export const LOCAL_AUTH_COOKIE = "cb_local_auth";
export const LOCAL_ADMIN_EMAIL = "admin@continental.local";
export const LOCAL_ADMIN_PASSWORD = "admin12345";

export type LocalAuthSession = {
  id: string;
  email: string;
  profile: Profile;
};

type LocalProfileInput = {
  fullName: string;
  email: string;
  phone?: string | null;
  country?: string | null;
  preferredLanguage?: string;
  preferredCurrency?: Currency;
};

export function createLocalClientSession(input: LocalProfileInput): LocalAuthSession {
  const email = input.email.trim().toLowerCase();
  const id = localIdFor(email);
  const now = new Date().toISOString();

  const profile: Profile = {
    id,
    full_name: input.fullName.trim(),
    email,
    phone: input.phone || null,
    country: input.country || "US",
    preferred_language: input.preferredLanguage || "en",
    preferred_currency: input.preferredCurrency || "USD",
    role: "client",
    account_status: "approved",
    account_number: accountNumberFor(email),
    avatar_url: null,
    created_at: now,
    updated_at: now,
  };

  return { id, email, profile };
}

export function createLocalAdminSession(): LocalAuthSession {
  const email = LOCAL_ADMIN_EMAIL;
  const now = new Date().toISOString();
  const profile: Profile = {
    id: localIdFor(email),
    full_name: "Development Admin",
    email,
    phone: null,
    country: "US",
    preferred_language: "en",
    preferred_currency: "USD",
    role: "super_admin",
    account_status: "approved",
    account_number: "CB000000000001",
    avatar_url: null,
    created_at: now,
    updated_at: now,
  };

  return { id: profile.id, email, profile };
}

export function localNameFromEmail(email: string) {
  const raw = email.split("@")[0]?.replace(/[._-]+/g, " ").trim() || "Private Client";
  return raw.replace(/\b\w/g, (char) => char.toUpperCase());
}

export function isLocalAdminCredential(email: string, password: string) {
  return email.trim().toLowerCase() === LOCAL_ADMIN_EMAIL && password === LOCAL_ADMIN_PASSWORD;
}

export function encodeLocalAuthSession(session: LocalAuthSession) {
  const json = JSON.stringify(session);
  const bytes = new TextEncoder().encode(json);
  let binary = "";
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

export function decodeLocalAuthSession(value: string | undefined | null): LocalAuthSession | null {
  if (!value) return null;

  try {
    const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized.padEnd(normalized.length + ((4 - (normalized.length % 4)) % 4), "=");
    const binary = atob(padded);
    const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
    const parsed = JSON.parse(new TextDecoder().decode(bytes)) as LocalAuthSession;

    if (!parsed?.id || !parsed.email || !parsed.profile?.role) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function localWallets(userId: string, preferredCurrency: Currency = "USD"): Wallet[] {
  const now = new Date().toISOString();
  return CURRENCIES.map((currency) => ({
    id: `local-wallet-${currency.toLowerCase()}`,
    user_id: userId,
    currency,
    available_balance: currency === preferredCurrency ? 0 : 0,
    pending_balance: 0,
    total_withdrawn: 0,
    created_at: now,
    updated_at: now,
  }));
}

function localIdFor(value: string) {
  return `local-${hashString(value).toString(16).padStart(8, "0")}`;
}

function accountNumberFor(email: string) {
  const number = String(hashString(email)).padStart(12, "0").slice(0, 12);
  return `CB${number}`;
}

function hashString(value: string) {
  let hash = 2166136261;
  for (let i = 0; i < value.length; i += 1) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}
