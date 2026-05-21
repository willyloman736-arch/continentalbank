/**
 * Continental Bank — DEMO risk & compliance
 *
 * Models the data Compliance officers work with:
 *  - KYC reviews (per-document verification status)
 *  - Risk flags (applied to a profile, with severity + note)
 *  - Compliance events (timeline)
 */

import { demoAdminProfile, demoClientProfile, demoClientRoster } from "./data";
import type { Profile } from "@/lib/types/database";

export type KycDocStatus = "missing" | "submitted" | "verified" | "rejected" | "expired";
export type KycDocKind = "passport" | "national_id" | "proof_of_address" | "source_of_funds" | "tax_certificate";

export type KycDocument = {
  id: string;
  user_id: string;
  kind: KycDocKind;
  status: KycDocStatus;
  /** Issuing authority where known */
  issuer?: string;
  /** Expiry date for documents that have one */
  expires_at?: string;
  submitted_at: string;
  reviewed_at?: string;
  reviewer_full_name?: string;
  review_note?: string;
};

export type RiskSeverity = "low" | "medium" | "high" | "critical";

export type RiskFlag = {
  id: string;
  user_id: string;
  category:
    | "pep" // Politically Exposed Person
    | "high_risk_jurisdiction"
    | "unusual_activity"
    | "sanctions"
    | "documentation_gap"
    | "manual_review";
  severity: RiskSeverity;
  note: string;
  raised_by_full_name: string;
  raised_at: string;
  resolved_at?: string;
  resolved_by_full_name?: string;
};

export type ComplianceEvent = {
  id: string;
  user_id: string;
  user_full_name: string;
  kind: "kyc_verified" | "kyc_rejected" | "flag_raised" | "flag_resolved" | "account_frozen" | "account_thawed";
  detail: string;
  by_full_name: string;
  at: string;
};

const ISO = (d: string) => new Date(d).toISOString();

/* ------------------------------------------------------------------ *
 *  Labels
 * ------------------------------------------------------------------ */

export const KYC_DOC_LABEL: Record<KycDocKind, string> = {
  passport: "Passport",
  national_id: "National ID",
  proof_of_address: "Proof of address",
  source_of_funds: "Source of funds",
  tax_certificate: "Tax residency certificate",
};

export const KYC_STATUS_LABEL: Record<KycDocStatus, string> = {
  missing: "Not submitted",
  submitted: "Awaiting review",
  verified: "Verified",
  rejected: "Rejected",
  expired: "Expired",
};

export const RISK_CATEGORY_LABEL: Record<RiskFlag["category"], string> = {
  pep: "PEP — Politically Exposed Person",
  high_risk_jurisdiction: "High-risk jurisdiction",
  unusual_activity: "Unusual activity",
  sanctions: "Sanctions screening",
  documentation_gap: "Documentation gap",
  manual_review: "Manual review",
};

export const RISK_SEVERITY_LABEL: Record<RiskSeverity, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
  critical: "Critical",
};

/* ------------------------------------------------------------------ *
 *  Seed data
 * ------------------------------------------------------------------ */

export const demoKycDocuments: KycDocument[] = [
  // Madame Bertrand — fully verified
  {
    id: "kyc-doc-1",
    user_id: demoClientProfile.id,
    kind: "passport",
    status: "verified",
    issuer: "République française",
    expires_at: ISO("2031-06-12T00:00:00Z"),
    submitted_at: ISO("2022-03-13T14:22:00Z"),
    reviewed_at: ISO("2022-03-13T15:04:00Z"),
    reviewer_full_name: "C. Rougier",
    review_note: "In-person at the Geneva office. No exceptions.",
  },
  {
    id: "kyc-doc-2",
    user_id: demoClientProfile.id,
    kind: "proof_of_address",
    status: "verified",
    issuer: "Services Industriels de Genève",
    submitted_at: ISO("2022-03-13T14:30:00Z"),
    reviewed_at: ISO("2022-03-13T15:08:00Z"),
    reviewer_full_name: "C. Rougier",
  },
  {
    id: "kyc-doc-3",
    user_id: demoClientProfile.id,
    kind: "source_of_funds",
    status: "verified",
    submitted_at: ISO("2022-03-15T09:14:00Z"),
    reviewed_at: ISO("2022-03-16T11:42:00Z"),
    reviewer_full_name: "É. Dupont",
    review_note: "Inheritance documentation accepted.",
  },
  {
    id: "kyc-doc-4",
    user_id: demoClientProfile.id,
    kind: "tax_certificate",
    status: "verified",
    issuer: "AFC, Switzerland",
    expires_at: ISO("2027-03-31T00:00:00Z"),
    submitted_at: ISO("2025-04-02T10:00:00Z"),
    reviewed_at: ISO("2025-04-03T08:24:00Z"),
    reviewer_full_name: "C. Rougier",
  },

  // Sofia Marchetti — pending review
  {
    id: "kyc-doc-5",
    user_id: "demo-client-0004",
    kind: "passport",
    status: "submitted",
    issuer: "Repubblica Italiana",
    submitted_at: ISO("2026-05-17T09:14:00Z"),
  },
  {
    id: "kyc-doc-6",
    user_id: "demo-client-0004",
    kind: "proof_of_address",
    status: "submitted",
    submitted_at: ISO("2026-05-17T09:15:00Z"),
  },
  {
    id: "kyc-doc-7",
    user_id: "demo-client-0004",
    kind: "source_of_funds",
    status: "missing",
    submitted_at: ISO("2026-05-17T09:14:00Z"),
  },

  // Akira Tanaka — pending review
  {
    id: "kyc-doc-8",
    user_id: "demo-client-0005",
    kind: "passport",
    status: "submitted",
    issuer: "Japan",
    submitted_at: ISO("2026-05-18T22:01:00Z"),
  },
  {
    id: "kyc-doc-9",
    user_id: "demo-client-0005",
    kind: "proof_of_address",
    status: "submitted",
    submitted_at: ISO("2026-05-18T22:01:00Z"),
  },

  // Beatrice Lindqvist — suspended, has expired doc
  {
    id: "kyc-doc-10",
    user_id: "demo-client-0006",
    kind: "passport",
    status: "expired",
    issuer: "Konungariket Sverige",
    expires_at: ISO("2025-11-08T00:00:00Z"),
    submitted_at: ISO("2020-11-02T10:00:00Z"),
    reviewed_at: ISO("2020-11-02T11:48:00Z"),
    reviewer_full_name: "C. Rougier",
  },
  {
    id: "kyc-doc-11",
    user_id: "demo-client-0006",
    kind: "tax_certificate",
    status: "expired",
    issuer: "Skatteverket, Sweden",
    expires_at: ISO("2026-01-31T00:00:00Z"),
    submitted_at: ISO("2024-02-04T09:00:00Z"),
    reviewed_at: ISO("2024-02-04T11:11:00Z"),
    reviewer_full_name: "É. Dupont",
  },
];

export const demoRiskFlags: RiskFlag[] = [
  {
    id: "flag-1",
    user_id: "demo-client-0006",
    category: "documentation_gap",
    severity: "high",
    note: "Passport expired 8 Nov 2025. Tax certificate expired 31 Jan 2026. Account suspended pending KYC refresh.",
    raised_by_full_name: "C. Rougier",
    raised_at: ISO("2026-04-04T14:18:00Z"),
  },
  {
    id: "flag-2",
    user_id: "demo-client-0003",
    category: "high_risk_jurisdiction",
    severity: "medium",
    note: "Standard enhanced due diligence for UAE-based principals. Quarterly review recommended.",
    raised_by_full_name: "C. Rougier",
    raised_at: ISO("2024-02-19T10:00:00Z"),
  },
  {
    id: "flag-3",
    user_id: "demo-client-0004",
    category: "manual_review",
    severity: "low",
    note: "New onboarding — awaiting source-of-funds documentation.",
    raised_by_full_name: "C. Rougier",
    raised_at: ISO("2026-05-17T09:20:00Z"),
  },
];

export const demoComplianceEvents: ComplianceEvent[] = [
  {
    id: "evt-1",
    user_id: "demo-client-0006",
    user_full_name: "Beatrice Lindqvist",
    kind: "account_frozen",
    detail: "Account suspended pending KYC refresh.",
    by_full_name: "C. Rougier",
    at: ISO("2026-04-04T14:18:00Z"),
  },
  {
    id: "evt-2",
    user_id: "demo-client-0004",
    user_full_name: "Sofia Marchetti",
    kind: "flag_raised",
    detail: "Manual review flag — new onboarding pending source-of-funds.",
    by_full_name: "C. Rougier",
    at: ISO("2026-05-17T09:20:00Z"),
  },
  {
    id: "evt-3",
    user_id: demoClientProfile.id,
    user_full_name: demoClientProfile.full_name,
    kind: "kyc_verified",
    detail: "Tax residency certificate re-verified.",
    by_full_name: "C. Rougier",
    at: ISO("2025-04-03T08:24:00Z"),
  },
  {
    id: "evt-4",
    user_id: "demo-client-0003",
    user_full_name: "Yusuf Al-Hashimi",
    kind: "flag_raised",
    detail: "Enhanced due diligence — UAE jurisdiction.",
    by_full_name: "C. Rougier",
    at: ISO("2024-02-19T10:00:00Z"),
  },
];

/* ------------------------------------------------------------------ *
 *  Helpers
 * ------------------------------------------------------------------ */

export function kycSummaryFor(userId: string) {
  const docs = demoKycDocuments.filter((d) => d.user_id === userId);
  const verified = docs.filter((d) => d.status === "verified").length;
  const pending = docs.filter((d) => d.status === "submitted").length;
  const expired = docs.filter((d) => d.status === "expired").length;
  const rejected = docs.filter((d) => d.status === "rejected").length;
  return { total: docs.length, verified, pending, expired, rejected, docs };
}

export function riskScore(userId: string) {
  const flags = demoRiskFlags.filter((f) => f.user_id === userId && !f.resolved_at);
  if (flags.length === 0) return { score: 0, band: "clear" as const };
  const weight: Record<RiskSeverity, number> = { low: 10, medium: 25, high: 55, critical: 90 };
  const total = flags.reduce((s, f) => s + weight[f.severity], 0);
  const band =
    total >= 80 ? "critical" : total >= 50 ? "high" : total >= 20 ? "elevated" : "monitored";
  return { score: Math.min(100, total), band: band as "clear" | "monitored" | "elevated" | "high" | "critical" };
}

/** All clients (with optional filters) enriched with KYC + risk summaries for the compliance dashboard. */
export function complianceRoster() {
  return demoClientRoster
    .filter((p) => p.role === "client")
    .map((p) => {
      const kyc = kycSummaryFor(p.id);
      const score = riskScore(p.id);
      const flags = demoRiskFlags.filter((f) => f.user_id === p.id && !f.resolved_at);
      return { profile: p, kyc, score, flags };
    });
}

export function demoAdminFullName() {
  return demoAdminProfile.full_name;
}

export type ComplianceRosterRow = ReturnType<typeof complianceRoster>[number];
export type { Profile };
