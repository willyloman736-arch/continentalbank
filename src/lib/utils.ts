import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const CURRENCY_LOCALE: Record<string, string> = {
  USD: "en-US",
  EUR: "de-DE",
  GBP: "en-GB",
};

const CURRENCY_SYMBOL: Record<string, string> = {
  USD: "$",
  EUR: "€",
  GBP: "£",
};

export function formatCurrency(
  amount: number | string,
  currency: string = "USD",
  options: Intl.NumberFormatOptions = {},
) {
  const value = typeof amount === "string" ? Number(amount) : amount;
  if (!Number.isFinite(value)) return `${CURRENCY_SYMBOL[currency] ?? ""}0.00`;
  const locale = CURRENCY_LOCALE[currency] ?? "en-US";
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    ...options,
  }).format(value);
}

export function formatAccountNumber(n?: string | null) {
  if (!n) return "—";
  return n.replace(/(.{4})/g, "$1 ").trim();
}

export function maskAccountNumber(n?: string | null) {
  if (!n) return "—";
  if (n.length <= 4) return n;
  return `•••• •••• ${n.slice(-4)}`;
}

export function formatDate(date: string | Date, opts: Intl.DateTimeFormatOptions = {}) {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    ...opts,
  }).format(d);
}

export function formatDateTime(date: string | Date) {
  return formatDate(date, {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function generateAccountNumber() {
  // 12-digit institutional reference, prefixed with CB
  const segment = () => Math.floor(1000 + Math.random() * 9000).toString();
  return `CB${segment()}${segment()}${segment()}`;
}

export function initials(name?: string | null) {
  if (!name) return "•";
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

export function clamp(n: number, min: number, max: number) {
  return Math.min(Math.max(n, min), max);
}

export function sleep(ms: number) {
  return new Promise<void>((r) => setTimeout(r, ms));
}
