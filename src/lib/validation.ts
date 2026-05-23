import { z } from "zod";
import { CURRENCIES as CURRENCY_CONST, KYC_METHODS } from "@/lib/constants";
import { SUPPORTED_LOCALES } from "@/lib/i18n/dictionaries";

export const CURRENCIES = CURRENCY_CONST as unknown as [string, ...string[]];
export const SUPPORTED_LOCALES_VALUES = SUPPORTED_LOCALES as unknown as [string, ...string[]];
export const KYC_METHOD_VALUES = KYC_METHODS.map((m) => m.id) as unknown as [string, ...string[]];

export const WithdrawalRequestSchema = z.object({
  currency: z.enum(CURRENCIES as unknown as [string, ...string[]]),
  amount: z
    .number()
    .positive("Enter an amount greater than zero")
    .max(10_000_000, "Amount exceeds single-transaction limit"),
  method: z.string().min(1, "Select a method"),
  paymentDetails: z.record(z.string()).default({}),
  notes: z.string().max(2000).optional(),
});

export const AdminBalanceAdjustmentSchema = z.object({
  userId: z.string().uuid(),
  currency: z.enum(CURRENCIES as unknown as [string, ...string[]]),
  type: z.enum(["deposit", "withdrawal", "adjustment", "fee", "transfer", "interest"]),
  amount: z.number().refine((n) => n !== 0, "Amount cannot be zero"),
  description: z.string().max(2000).optional(),
});

export const SupportTicketSchema = z.object({
  subject: z.string().min(3).max(200),
  message: z.string().min(10).max(5000),
});

export const ProfileUpdateSchema = z.object({
  fullName: z.string().min(2).max(120),
  phone: z.string().max(40).optional().or(z.literal("")),
  country: z.string().min(2).max(2),
  preferredLanguage: z.enum(SUPPORTED_LOCALES_VALUES),
  preferredCurrency: z.enum(CURRENCIES as unknown as [string, ...string[]]),
});

export const KycSubmissionSchema = z.object({
  method: z.enum(KYC_METHOD_VALUES),
});

export const KycDecisionSchema = z.object({
  userId: z.string().min(1),
  decision: z.enum(["under_review", "approved", "rejected"]),
  note: z.string().max(2000).optional(),
});

export const PasswordChangeSchema = z
  .object({
    currentPassword: z.string().min(1),
    newPassword: z.string().min(8, "Use at least 8 characters"),
    confirmPassword: z.string().min(8),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: "New passwords do not match",
    path: ["confirmPassword"],
  });

export const WithdrawalDecisionSchema = z.object({
  id: z.string().uuid(),
  decision: z.enum(["approved", "rejected", "completed"]),
  adminNote: z.string().max(2000).optional(),
});

export const TicketReplySchema = z.object({
  id: z.string().uuid(),
  reply: z.string().min(1).max(5000),
  status: z.enum(["open", "in_progress", "resolved", "closed"]),
});

export const UserDecisionSchema = z.object({
  userId: z.string().uuid(),
  decision: z.enum(["approve", "reject", "suspend"]),
  note: z.string().max(1000).optional(),
});

export const PublicRefundClaimSchema = z.object({
  claimantName: z.string().min(2, "Enter your full legal name").max(120),
  claimantEmail: z.string().email("Enter a valid email"),
  claimantPhone: z.string().max(40).optional().or(z.literal("")),
  accountReference: z
    .string()
    .max(60)
    .optional()
    .or(z.literal("")),
  transactionReference: z.string().max(120).optional().or(z.literal("")),
  currency: z.enum(CURRENCIES as unknown as [string, ...string[]]).optional(),
  amount: z
    .number()
    .positive("Enter an amount greater than zero")
    .max(10_000_000, "Amount exceeds the maximum a single claim may carry"),
  reason: z.string().min(2).max(60),
  description: z
    .string()
    .min(20, "Please describe what happened in at least 20 characters")
    .max(5000),
});

export const ClientRefundDisputeSchema = z.object({
  relatedTransactionId: z.string().uuid().optional().or(z.literal("")),
  transactionReference: z.string().max(120).optional().or(z.literal("")),
  currency: z.enum(CURRENCIES as unknown as [string, ...string[]]),
  amount: z.number().positive().max(10_000_000),
  reason: z.string().min(2).max(60),
  description: z.string().min(20).max(5000),
});

export const RefundDecisionSchema = z.object({
  id: z.string().uuid(),
  decision: z.enum(["under_review", "approved", "rejected", "completed"]),
  adminNote: z.string().max(2000).optional(),
});

export const AdminCreateUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  fullName: z.string().min(2).max(120),
  country: z.string().min(2).max(2),
  preferredCurrency: z.enum(CURRENCIES as unknown as [string, ...string[]]),
  preferredLanguage: z.enum(SUPPORTED_LOCALES_VALUES),
  role: z.enum(["client", "support_admin", "finance_admin", "super_admin"]),
  status: z.enum(["pending", "approved"]).default("approved"),
});
