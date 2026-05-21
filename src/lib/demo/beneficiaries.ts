/**
 * Continental Bank — DEMO beneficiaries
 *
 * Saved outbound destinations. Each is reviewed and approved by a
 * finance officer before a withdrawal can be routed to it. Officers
 * see a pending queue; clients see only their own beneficiaries.
 */

import { demoClientProfile, demoClientRoster } from "./data";

export type BeneficiaryRail =
  | "bank_wire"
  | "sepa"
  | "uk_faster"
  | "paypal"
  | "wise"
  | "revolut"
  | "zelle"
  | "cashapp";

export type BeneficiaryStatus = "pending" | "approved" | "rejected" | "expired";

export type Beneficiary = {
  id: string;
  user_id: string;
  /** Friendly label the client picks ("Citibank · operating") */
  nickname: string;
  /** Legal name of the recipient as it appears at the rail */
  account_holder: string;
  rail: BeneficiaryRail;
  currency: "USD" | "EUR" | "GBP";
  /** Country of the receiving institution */
  country: string;
  /** Masked identifier shown in lists */
  destination_masked: string;
  /** Optional bank name for wires */
  bank?: string;
  /** Optional notes (e.g. "Operating account; weekly transfers") */
  notes?: string;
  status: BeneficiaryStatus;
  /** True if this is the client's default for the currency */
  is_default: boolean;
  /** Captured at submission */
  submitted_by_full_name: string;
  /** Officer who reviewed */
  reviewed_by_full_name?: string;
  review_note?: string;
  created_at: string;
  reviewed_at?: string;
};

const ISO = (d: string) => new Date(d).toISOString();

export const BENEFICIARY_RAIL_LABEL: Record<BeneficiaryRail, string> = {
  bank_wire: "Bank Wire",
  sepa: "SEPA Transfer",
  uk_faster: "UK Faster Payments",
  paypal: "PayPal",
  wise: "Wise",
  revolut: "Revolut",
  zelle: "Zelle",
  cashapp: "Cash App",
};

export const BENEFICIARY_RAIL_BY_CURRENCY: Record<
  "USD" | "EUR" | "GBP",
  BeneficiaryRail[]
> = {
  USD: ["bank_wire", "paypal", "wise", "zelle", "cashapp"],
  EUR: ["sepa", "bank_wire", "paypal", "wise", "revolut"],
  GBP: ["uk_faster", "bank_wire", "paypal", "wise", "revolut"],
};

export const BENEFICIARY_STATUS_LABEL: Record<BeneficiaryStatus, string> = {
  pending: "Awaiting approval",
  approved: "Approved",
  rejected: "Rejected",
  expired: "Expired",
};

export const demoClientBeneficiaries: Beneficiary[] = [
  {
    id: "ben-1",
    user_id: demoClientProfile.id,
    nickname: "Citibank · operating",
    account_holder: "Hélène Bertrand",
    rail: "bank_wire",
    currency: "USD",
    country: "US",
    bank: "Citibank N.A., New York",
    destination_masked: "•••• •••• 4419 · SWIFT CITIUS33",
    notes: "Primary USD operating account.",
    status: "approved",
    is_default: true,
    submitted_by_full_name: demoClientProfile.full_name,
    reviewed_by_full_name: "É. Dupont",
    review_note: "Verified against KYC file.",
    created_at: ISO("2022-04-02T10:00:00Z"),
    reviewed_at: ISO("2022-04-02T16:14:00Z"),
  },
  {
    id: "ben-2",
    user_id: demoClientProfile.id,
    nickname: "Lombard Geneva · personal",
    account_holder: "Hélène Bertrand",
    rail: "bank_wire",
    currency: "EUR",
    country: "CH",
    bank: "Banque Lombard Odier, Geneva",
    destination_masked: "CH•• •••• •••• •••• 7240 · SWIFT LOCHCHGGG",
    status: "approved",
    is_default: true,
    submitted_by_full_name: demoClientProfile.full_name,
    reviewed_by_full_name: "É. Dupont",
    review_note: "Bank confirmed by phone.",
    created_at: ISO("2022-04-04T09:18:00Z"),
    reviewed_at: ISO("2022-04-04T11:02:00Z"),
  },
  {
    id: "ben-3",
    user_id: demoClientProfile.id,
    nickname: "Coutts London · personal",
    account_holder: "Hélène Bertrand",
    rail: "uk_faster",
    currency: "GBP",
    country: "GB",
    bank: "Coutts & Co., London",
    destination_masked: "18-00-02 · ••••5512",
    status: "approved",
    is_default: true,
    submitted_by_full_name: demoClientProfile.full_name,
    reviewed_by_full_name: "É. Dupont",
    created_at: ISO("2024-01-12T14:05:00Z"),
    reviewed_at: ISO("2024-01-12T15:48:00Z"),
  },
  {
    id: "ben-4",
    user_id: demoClientProfile.id,
    nickname: "Wise · multi-currency",
    account_holder: "Hélène Bertrand",
    rail: "wise",
    currency: "USD",
    country: "BE",
    destination_masked: "h.bertrand@example.com",
    status: "approved",
    is_default: false,
    submitted_by_full_name: demoClientProfile.full_name,
    reviewed_by_full_name: "É. Dupont",
    created_at: ISO("2024-08-19T08:30:00Z"),
    reviewed_at: ISO("2024-08-19T10:11:00Z"),
  },
  {
    id: "ben-5",
    user_id: demoClientProfile.id,
    nickname: "Counsel · Frankfurt",
    account_holder: "Müller & Partners GmbH",
    rail: "sepa",
    currency: "EUR",
    country: "DE",
    bank: "Commerzbank, Frankfurt",
    destination_masked: "DE89 3704 0044 0532 •••• ••",
    notes: "For invoiced services only.",
    status: "pending",
    is_default: false,
    submitted_by_full_name: demoClientProfile.full_name,
    created_at: ISO("2026-05-15T09:02:00Z"),
  },
];

/**
 * Cross-client beneficiaries that surface in the admin queue.
 */
export const demoAdminBeneficiaryQueue: (Beneficiary & {
  client_name: string;
  client_account: string | null;
})[] = [
  ...demoClientBeneficiaries.map((b) => ({
    ...b,
    client_name: demoClientProfile.full_name,
    client_account: demoClientProfile.account_number,
  })),
  {
    id: "ben-q-1",
    user_id: "demo-client-0002",
    nickname: "HSBC London · Mayfair",
    account_holder: "Marcus Ainsworth",
    rail: "uk_faster",
    currency: "GBP",
    country: "GB",
    bank: "HSBC UK, London",
    destination_masked: "40-05-13 · ••••8821",
    status: "pending",
    is_default: false,
    submitted_by_full_name: "Marcus Ainsworth",
    created_at: ISO("2026-05-19T08:42:00Z"),
    client_name: "Marcus Ainsworth",
    client_account:
      demoClientRoster.find((p) => p.id === "demo-client-0002")?.account_number ?? null,
  },
  {
    id: "ben-q-2",
    user_id: "demo-client-0003",
    nickname: "Mashreq · Dubai operating",
    account_holder: "Yusuf Al-Hashimi",
    rail: "bank_wire",
    currency: "USD",
    country: "AE",
    bank: "Mashreq Bank, Dubai",
    destination_masked: "AE•• •••• •••• 8821-5572",
    status: "pending",
    is_default: false,
    submitted_by_full_name: "Yusuf Al-Hashimi",
    created_at: ISO("2026-05-19T05:14:00Z"),
    client_name: "Yusuf Al-Hashimi",
    client_account:
      demoClientRoster.find((p) => p.id === "demo-client-0003")?.account_number ?? null,
  },
];
