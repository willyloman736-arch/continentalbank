/**
 * Continental Bank — DEMO document vault
 *
 * Six types modelled:
 *   statement     — monthly portfolio statement
 *   account_letter — welcome / KYC confirmation / mandate changes
 *   kyc            — uploaded ID / proof of address
 *   withdrawal_receipt — per completed withdrawal
 *   refund_evidence    — per approved refund claim
 *   tax           — annual tax summary
 */

import { demoClientProfile } from "./data";

export type DocumentType =
  | "statement"
  | "account_letter"
  | "kyc"
  | "withdrawal_receipt"
  | "refund_evidence"
  | "tax";

export type DocumentRecord = {
  id: string;
  user_id: string;
  type: DocumentType;
  title: string;
  description: string;
  /** Human size label, e.g. "184 KB". */
  size: string;
  /** Optional 2-letter currency tag rendered in the corner. */
  currency?: "USD" | "EUR" | "GBP";
  /** Optional reference number printed on the document. */
  reference?: string;
  created_at: string;
  /** Body content the printable HTML page renders. */
  body: {
    heading: string;
    subheading?: string;
    rows: Array<{ label: string; value: string }>;
    paragraph?: string;
    closing?: string;
  };
};

const ISO = (d: string) => new Date(d).toISOString();

export const DOCUMENT_TYPE_LABELS: Record<DocumentType, string> = {
  statement: "Account statement",
  account_letter: "Account letter",
  kyc: "KYC document",
  withdrawal_receipt: "Withdrawal receipt",
  refund_evidence: "Refund evidence",
  tax: "Tax summary",
};

export const demoClientDocuments: DocumentRecord[] = [
  // ---- Statements (recent months) ------------------------------------
  {
    id: "doc-stmt-202604",
    user_id: demoClientProfile.id,
    type: "statement",
    title: "April 2026 — Consolidated statement",
    description: "USD · EUR · GBP portfolios. Reconciled by the Geneva desk.",
    size: "248 KB",
    reference: "STMT-2026-04-CB491072820314",
    created_at: ISO("2026-05-02T08:00:00Z"),
    body: {
      heading: "Consolidated portfolio statement",
      subheading: "Period: 1 April 2026 — 30 April 2026",
      rows: [
        { label: "Opening balance (USD eq.)", value: "$ 4,402,118.80" },
        { label: "Net inflows", value: "+ $ 261,235.55" },
        { label: "Net outflows", value: "− $ 47,693.00" },
        { label: "Interest credited", value: "+ $ 11,850.41" },
        { label: "Closing balance (USD eq.)", value: "$ 4,627,510.88" },
      ],
      paragraph:
        "All figures are reported per currency at face value. Consolidated equivalents are computed at the EOM Geneva fix and shown for reporting convenience only.",
      closing: "Reconciled by É. Dupont, Private Banker · Continental Bank, Geneva",
    },
  },
  {
    id: "doc-stmt-202603",
    user_id: demoClientProfile.id,
    type: "statement",
    title: "March 2026 — Consolidated statement",
    description: "Quarterly close · audited by internal compliance.",
    size: "262 KB",
    reference: "STMT-2026-03-CB491072820314",
    created_at: ISO("2026-04-02T08:00:00Z"),
    body: {
      heading: "Consolidated portfolio statement",
      subheading: "Period: 1 March 2026 — 31 March 2026",
      rows: [
        { label: "Opening balance (USD eq.)", value: "$ 4,221,400.12" },
        { label: "Net inflows", value: "+ $ 198,802.20" },
        { label: "Net outflows", value: "− $ 22,300.00" },
        { label: "Interest credited", value: "+ $ 4,216.48" },
        { label: "Closing balance (USD eq.)", value: "$ 4,402,118.80" },
      ],
      paragraph:
        "Quarterly review completed. Mandate parameters unchanged. No exceptions raised.",
      closing: "Reconciled by É. Dupont, Private Banker · Continental Bank, Geneva",
    },
  },
  {
    id: "doc-stmt-202602",
    user_id: demoClientProfile.id,
    type: "statement",
    title: "February 2026 — Consolidated statement",
    description: "Monthly close.",
    size: "242 KB",
    reference: "STMT-2026-02-CB491072820314",
    created_at: ISO("2026-03-02T08:00:00Z"),
    body: {
      heading: "Consolidated portfolio statement",
      subheading: "Period: 1 February 2026 — 28 February 2026",
      rows: [
        { label: "Opening balance (USD eq.)", value: "$ 4,098,700.00" },
        { label: "Net inflows", value: "+ $ 138,400.10" },
        { label: "Net outflows", value: "− $ 18,100.00" },
        { label: "Interest credited", value: "+ $ 2,400.02" },
        { label: "Closing balance (USD eq.)", value: "$ 4,221,400.12" },
      ],
      closing: "Reconciled by É. Dupont, Private Banker · Continental Bank, Geneva",
    },
  },

  // ---- Account letters ----------------------------------------------
  {
    id: "doc-letter-welcome",
    user_id: demoClientProfile.id,
    type: "account_letter",
    title: "Welcome to Continental Bank",
    description: "Opening of private client account · CB491072820314",
    size: "92 KB",
    reference: "LTR-WLC-2022-03-14",
    created_at: ISO("2022-03-14T11:00:00Z"),
    body: {
      heading: "Welcome to Continental Bank",
      subheading: "Private Client Office · Geneva",
      rows: [
        { label: "Account reference", value: "CB · 4910 · 7282 · 0314" },
        { label: "Account class", value: "Private Client — Global Treasury Reserve" },
        { label: "Reporting currency", value: "USD" },
        { label: "Relationship manager", value: "É. Dupont (Geneva)" },
      ],
      paragraph:
        "Madame Bertrand, we are honoured to confirm the opening of your private client account at Continental Bank. Your reference will appear on every instruction, statement, and confirmation we issue. We remain at your disposal, in discretion.",
      closing: "É. Marchand · Chairman, Continental Bank · Geneva",
    },
  },
  {
    id: "doc-letter-mandate",
    user_id: demoClientProfile.id,
    type: "account_letter",
    title: "Mandate confirmation — Q2 2026",
    description: "Confirmation of quarterly treasury mandate parameters.",
    size: "78 KB",
    reference: "LTR-MND-Q2-2026",
    created_at: ISO("2026-04-04T09:30:00Z"),
    body: {
      heading: "Mandate confirmation — Q2 2026",
      subheading: "Reviewed and acknowledged",
      rows: [
        { label: "Mandate type", value: "Global treasury reserve" },
        { label: "Approval band", value: "Up to $ 250,000 (single instruction)" },
        { label: "Dual-officer threshold", value: "Above $ 250,000" },
        { label: "Reporting cadence", value: "Monthly statement · Quarterly review" },
      ],
      paragraph:
        "Your mandate parameters for Q2 2026 are reconfirmed without amendment. Any change of beneficial address, taxation, or controlling persons should be communicated through the secure message centre.",
      closing: "É. Dupont, Private Banker · Continental Bank, Geneva",
    },
  },

  // ---- KYC ------------------------------------------------------------
  {
    id: "doc-kyc-passport",
    user_id: demoClientProfile.id,
    type: "kyc",
    title: "Passport — verification confirmation",
    description: "Identity document verified · Compliance, Geneva",
    size: "118 KB",
    reference: "KYC-ID-CB491072820314",
    created_at: ISO("2022-03-13T14:22:00Z"),
    body: {
      heading: "Identity verification confirmation",
      subheading: "Continental Bank · Compliance, Geneva",
      rows: [
        { label: "Document type", value: "Passport" },
        { label: "Issuing authority", value: "République française" },
        { label: "Verification method", value: "In-person · Geneva office" },
        { label: "Verified by", value: "Compliance officer C. Rougier" },
        { label: "Status", value: "Verified — no exceptions" },
      ],
      paragraph:
        "We confirm that the identity document supplied has been examined in person, recorded against our compliance register, and accepted without exception.",
    },
  },
  {
    id: "doc-kyc-address",
    user_id: demoClientProfile.id,
    type: "kyc",
    title: "Proof of address — verification confirmation",
    description: "Utility statement · Compliance, Geneva",
    size: "96 KB",
    reference: "KYC-POA-CB491072820314",
    created_at: ISO("2022-03-13T14:30:00Z"),
    body: {
      heading: "Proof of address verification",
      subheading: "Continental Bank · Compliance, Geneva",
      rows: [
        { label: "Document type", value: "Utility statement (electricity)" },
        { label: "Issued by", value: "Services Industriels de Genève" },
        { label: "Address recorded", value: "Geneva, Switzerland" },
        { label: "Status", value: "Accepted" },
      ],
    },
  },

  // ---- Withdrawal receipts -------------------------------------------
  {
    id: "doc-wd-rcpt-1",
    user_id: demoClientProfile.id,
    type: "withdrawal_receipt",
    title: "Withdrawal receipt · USD 120,000",
    description: "Settled to Citibank · 28 April 2026",
    size: "64 KB",
    currency: "USD",
    reference: "WD-RCPT-2026-04-28-001",
    created_at: ISO("2026-04-28T11:08:00Z"),
    body: {
      heading: "Confirmation of outbound settlement",
      subheading: "Withdrawal completed",
      rows: [
        { label: "Amount", value: "$ 120,000.00 USD" },
        { label: "Beneficiary", value: "Bertrand · •••• •••• 4419 (Citibank, NY)" },
        { label: "Method", value: "Bank wire" },
        { label: "Reference", value: "8821-5572" },
        { label: "Date settled", value: "28 April 2026, 11:05 GMT+1" },
        { label: "Authorised by", value: "É. Dupont, Private Banker" },
      ],
      paragraph:
        "We confirm that the funds described above were settled to the beneficiary on the date and reference shown. Please retain this receipt for your records.",
    },
  },
  {
    id: "doc-wd-rcpt-2",
    user_id: demoClientProfile.id,
    type: "withdrawal_receipt",
    title: "Withdrawal receipt · GBP 12,500",
    description: "UK Faster Payments · 10 May 2026 (pending settlement)",
    size: "58 KB",
    currency: "GBP",
    reference: "WD-RCPT-2026-05-10-002",
    created_at: ISO("2026-05-10T11:18:00Z"),
    body: {
      heading: "Confirmation of outbound instruction",
      subheading: "Withdrawal approved — awaiting settlement",
      rows: [
        { label: "Amount", value: "£ 12,500.00 GBP" },
        { label: "Beneficiary", value: "12-34-56 · 12345678" },
        { label: "Method", value: "UK Faster Payments" },
        { label: "Status", value: "Approved — settling next business day" },
        { label: "Approved by", value: "É. Dupont, Private Banker" },
      ],
    },
  },

  // ---- Refund evidence -----------------------------------------------
  {
    id: "doc-refund-1",
    user_id: demoClientProfile.id,
    type: "refund_evidence",
    title: "Refund evidence · USD 4,300",
    description: "Counterparty error · returned to wallet",
    size: "72 KB",
    currency: "USD",
    reference: "REF-2026-03-19-001",
    created_at: ISO("2026-03-19T16:42:00Z"),
    body: {
      heading: "Refund evidence",
      subheading: "Counterparty error — funds returned to your USD wallet",
      rows: [
        { label: "Amount returned", value: "$ 4,300.00 USD" },
        { label: "Original outflow date", value: "12 March 2026" },
        { label: "Reason", value: "Counterparty over-debit" },
        { label: "Returned to", value: "USD wallet · available balance" },
        { label: "Authorised by", value: "É. Dupont, Private Banker" },
      ],
      paragraph:
        "The amount above was returned to your available balance following review with the counterparty. No action required on your part.",
    },
  },

  // ---- Tax ------------------------------------------------------------
  {
    id: "doc-tax-2025",
    user_id: demoClientProfile.id,
    type: "tax",
    title: "Tax summary — 2025",
    description: "Annual interest credited, withholdings, currency breakdown.",
    size: "204 KB",
    reference: "TAX-2025-CB491072820314",
    created_at: ISO("2026-01-15T09:00:00Z"),
    body: {
      heading: "Annual tax summary — 2025",
      subheading: "For your records and your tax counsel",
      rows: [
        { label: "Interest credited (USD)", value: "$ 38,114.20" },
        { label: "Interest credited (EUR)", value: "€ 21,802.55" },
        { label: "Interest credited (GBP)", value: "£ 16,498.10" },
        { label: "Source withholdings", value: "Reported as nil" },
        { label: "Reporting jurisdiction", value: "Switzerland (CH)" },
      ],
      paragraph:
        "This summary is provided for your records. It is not a tax determination. Please share it with your appointed counsel for filing in your jurisdiction(s) of residence.",
      closing: "Continental Bank · Finance Office, Geneva",
    },
  },
];

export function docsByType(docs: DocumentRecord[]): Record<DocumentType, DocumentRecord[]> {
  return docs.reduce(
    (acc, d) => {
      acc[d.type].push(d);
      return acc;
    },
    {
      statement: [],
      account_letter: [],
      kyc: [],
      withdrawal_receipt: [],
      refund_evidence: [],
      tax: [],
    } as Record<DocumentType, DocumentRecord[]>,
  );
}
