/**
 * Continental Bank — DEMO notification feed
 *
 * Categories surfaced in the bell popover and the full notification page:
 *   account     — approval, suspension, KYC events
 *   withdrawal  — submitted, approved, completed, rejected
 *   refund      — claim submitted, approved, settled
 *   message     — admin reply on a thread
 *   security    — new device sign-in, password change
 *   document    — new statement / receipt / KYC document issued
 */

import { demoClientProfile } from "./data";

export type NotificationKind =
  | "account"
  | "withdrawal"
  | "refund"
  | "message"
  | "security"
  | "document";

export type NotificationSeverity = "info" | "success" | "warning" | "danger";

export type Notification = {
  id: string;
  user_id: string;
  kind: NotificationKind;
  severity: NotificationSeverity;
  title: string;
  body: string;
  /** Optional link the row navigates to */
  href?: string;
  /** Optional currency tag rendered as a small badge */
  currency?: "USD" | "EUR" | "GBP";
  /** Optional figure shown right-aligned */
  amount?: string;
  read: boolean;
  created_at: string;
};

const ISO = (d: string) => new Date(d).toISOString();

export const NOTIFICATION_KIND_LABELS: Record<NotificationKind, string> = {
  account: "Account",
  withdrawal: "Withdrawal",
  refund: "Refund",
  message: "Message",
  security: "Security",
  document: "Document",
};

export const demoClientNotifications: Notification[] = [
  // Newest first
  {
    id: "ntf-1",
    user_id: demoClientProfile.id,
    kind: "message",
    severity: "info",
    title: "New reply from Étienne Dupont",
    body: "Re: Add a new beneficiary — Frankfurt counsel · Mandate addendum template attached.",
    href: "/dashboard/messages/thr-beneficiary-add",
    read: false,
    created_at: ISO("2026-05-19T11:14:00Z"),
  },
  {
    id: "ntf-2",
    user_id: demoClientProfile.id,
    kind: "security",
    severity: "warning",
    title: "New sign-in detected",
    body: "Safari · macOS · Geneva, Switzerland · 82.150.108.4. If this wasn't you, contact the Private Office immediately.",
    href: "/dashboard/security",
    read: false,
    created_at: ISO("2026-05-19T08:14:00Z"),
  },
  {
    id: "ntf-3",
    user_id: demoClientProfile.id,
    kind: "withdrawal",
    severity: "info",
    title: "Withdrawal under review",
    body: "Your withdrawal instruction has been received and is awaiting officer review.",
    href: "/dashboard/withdrawals",
    currency: "USD",
    amount: "$ 75,000.00",
    read: true,
    created_at: ISO("2026-05-17T16:48:00Z"),
  },
  {
    id: "ntf-4",
    user_id: demoClientProfile.id,
    kind: "document",
    severity: "info",
    title: "April 2026 statement issued",
    body: "Consolidated statement across USD, EUR, and GBP portfolios. Reconciled by É. Dupont.",
    href: "/dashboard/documents?type=statement",
    read: true,
    created_at: ISO("2026-05-02T08:00:00Z"),
  },
  {
    id: "ntf-5",
    user_id: demoClientProfile.id,
    kind: "withdrawal",
    severity: "success",
    title: "Withdrawal approved",
    body: "Your GBP 12,500 withdrawal via UK Faster Payments has been approved and is settling.",
    href: "/dashboard/withdrawals",
    currency: "GBP",
    amount: "£ 12,500.00",
    read: true,
    created_at: ISO("2026-05-10T11:14:00Z"),
  },
  {
    id: "ntf-6",
    user_id: demoClientProfile.id,
    kind: "withdrawal",
    severity: "success",
    title: "Withdrawal completed",
    body: "Your withdrawal to Citibank · ••••4419 has been settled. Bank reference 8821-5572.",
    href: "/dashboard/documents?type=withdrawal_receipt",
    currency: "USD",
    amount: "$ 120,000.00",
    read: true,
    created_at: ISO("2026-04-28T11:05:00Z"),
  },
  {
    id: "ntf-7",
    user_id: demoClientProfile.id,
    kind: "refund",
    severity: "success",
    title: "Refund credited",
    body: "USD 4,300 returned to your USD wallet following counterparty review.",
    href: "/dashboard/refunds",
    currency: "USD",
    amount: "$ 4,300.00",
    read: true,
    created_at: ISO("2026-03-19T16:42:00Z"),
  },
  {
    id: "ntf-8",
    user_id: demoClientProfile.id,
    kind: "account",
    severity: "info",
    title: "Quarterly mandate review",
    body: "Q2 mandate parameters reconfirmed without amendment.",
    href: "/dashboard/documents?type=account_letter",
    read: true,
    created_at: ISO("2026-04-04T09:30:00Z"),
  },
];

export function unreadCount(list: Notification[]) {
  return list.filter((n) => !n.read).length;
}
