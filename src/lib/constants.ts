export const SITE = {
  name: "Continental Bank",
  shortName: "Continental",
  tagline: "Discreet private banking, established standards.",
  description:
    "A premium institutional client portal for multi-currency wealth management, withdrawal oversight, and discreet executive service.",
  domain: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  contact: {
    privateClient: "private-clients@continental.example",
    support: "concierge@continental.example",
  },
  estd: 1972,
} as const;

export const CURRENCIES = ["USD", "EUR", "GBP"] as const;
export type Currency = (typeof CURRENCIES)[number];

export const CURRENCY_LABELS: Record<Currency, string> = {
  USD: "US Dollar",
  EUR: "Euro",
  GBP: "British Pound",
};

export const COUNTRIES = [
  { code: "US", name: "United States" },
  { code: "GB", name: "United Kingdom" },
  { code: "FR", name: "France" },
  { code: "DE", name: "Germany" },
  { code: "CH", name: "Switzerland" },
  { code: "LU", name: "Luxembourg" },
  { code: "AE", name: "United Arab Emirates" },
  { code: "SG", name: "Singapore" },
  { code: "HK", name: "Hong Kong SAR" },
  { code: "JP", name: "Japan" },
  { code: "CA", name: "Canada" },
  { code: "AU", name: "Australia" },
  { code: "IT", name: "Italy" },
  { code: "ES", name: "Spain" },
  { code: "NL", name: "Netherlands" },
  { code: "BE", name: "Belgium" },
  { code: "IE", name: "Ireland" },
  { code: "SE", name: "Sweden" },
  { code: "NO", name: "Norway" },
  { code: "DK", name: "Denmark" },
] as const;

export const LANGUAGES = [
  { code: "en", name: "English" },
  { code: "fr", name: "Français" },
  { code: "de", name: "Deutsch" },
  { code: "es", name: "Español" },
  { code: "it", name: "Italiano" },
  { code: "ar", name: "العربية" },
  { code: "zh", name: "中文" },
] as const;

export const WITHDRAWAL_METHODS = {
  US: [
    { id: "paypal", label: "PayPal" },
    { id: "cashapp", label: "Cash App" },
    { id: "zelle", label: "Zelle" },
    { id: "bank_transfer", label: "Bank Transfer (ACH)" },
  ],
  EU_UK: [
    { id: "sepa", label: "SEPA Transfer" },
    { id: "iban", label: "IBAN Transfer" },
    { id: "wise", label: "Wise" },
    { id: "revolut", label: "Revolut" },
    { id: "uk_faster", label: "UK Faster Payments" },
    { id: "paypal", label: "PayPal" },
    { id: "bank_transfer", label: "Bank Transfer" },
  ],
} as const;

export type WithdrawalRegion = keyof typeof WITHDRAWAL_METHODS;

export const ACCOUNT_STATUS = {
  pending: "Awaiting Approval",
  approved: "Active",
  rejected: "Declined",
  suspended: "Suspended",
} as const;

export type AccountStatus = keyof typeof ACCOUNT_STATUS;

export const WITHDRAWAL_STATUS = {
  pending: "Pending Review",
  approved: "Approved",
  rejected: "Rejected",
  completed: "Completed",
} as const;

export type WithdrawalStatus = keyof typeof WITHDRAWAL_STATUS;

export const TRANSACTION_TYPES = {
  deposit: "Deposit",
  withdrawal: "Withdrawal",
  adjustment: "Adjustment",
  fee: "Fee",
  transfer: "Transfer",
  interest: "Interest",
} as const;

export type TransactionType = keyof typeof TRANSACTION_TYPES;

export const ADMIN_ROLES = ["super_admin", "finance_admin", "support_admin", "client"] as const;
export type Role = (typeof ADMIN_ROLES)[number];

export const ROLE_LABELS: Record<Role, string> = {
  super_admin: "Super Administrator",
  finance_admin: "Finance Administrator",
  support_admin: "Support Administrator",
  client: "Private Client",
};
