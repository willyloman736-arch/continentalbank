"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { getAuthedUser, requireAdmin, requireApprovedClient } from "@/lib/auth";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { isDemoMode, supabaseConfigured } from "@/lib/demo";
import { localAuthEnabled } from "@/lib/auth-mode";
import {
  ClientRefundDisputeSchema,
  PublicRefundClaimSchema,
  RefundDecisionSchema,
} from "@/lib/validation";
import type { ActionResult } from "./withdrawals";

const DEMO_MSG = "Demo mode — your claim is simulated, nothing is saved.";

async function clientIp() {
  const h = await headers();
  return h.get("x-forwarded-for")?.split(",")[0]?.trim() ?? h.get("x-real-ip") ?? null;
}

/* ---------------------------------------------------------- *
 *  Public claim — anyone can submit (no auth required)
 * ---------------------------------------------------------- */
export async function submitPublicRefundClaim(input: unknown): Promise<ActionResult> {
  const parsed = PublicRefundClaimSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid claim" };
  }

  if ((await isDemoMode()) || localAuthEnabled() || !supabaseConfigured()) {
    return { ok: true, message: DEMO_MSG };
  }

  // If the visitor happens to be signed-in, link the claim to their profile.
  // Otherwise it's an anonymous public claim (user_id = null).
  const me = await getAuthedUser();
  const service = createServiceClient();

  const { error } = await service.from("refund_claims").insert({
    user_id: me?.id ?? null,
    claim_type: "public_claim",
    claimant_name: parsed.data.claimantName,
    claimant_email: parsed.data.claimantEmail,
    claimant_phone: parsed.data.claimantPhone || null,
    account_reference: parsed.data.accountReference || null,
    transaction_reference: parsed.data.transactionReference || null,
    currency: (parsed.data.currency as "USD" | "EUR" | "GBP" | undefined) ?? null,
    amount: parsed.data.amount,
    description: parsed.data.description,
    supporting_info: { reason: parsed.data.reason },
    status: "pending",
  });

  if (error) return { ok: false, error: error.message };

  revalidatePath("/refund");
  revalidatePath("/admin/refunds");
  return {
    ok: true,
    message:
      "Claim received. A relationship officer will contact you within one business day.",
  };
}

/* ---------------------------------------------------------- *
 *  Client dispute — signed-in clients only
 * ---------------------------------------------------------- */
export async function submitClientRefundDispute(input: unknown): Promise<ActionResult> {
  const user = await requireApprovedClient();
  const parsed = ClientRefundDisputeSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid claim" };
  }

  if ((await isDemoMode()) || localAuthEnabled() || !supabaseConfigured()) {
    return { ok: true, message: DEMO_MSG };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("refund_claims").insert({
    user_id: user.id,
    claim_type: "transaction_dispute",
    claimant_name: user.profile.full_name,
    claimant_email: user.email ?? user.profile.email,
    claimant_phone: user.profile.phone,
    account_reference: user.profile.account_number,
    related_transaction_id: parsed.data.relatedTransactionId || null,
    transaction_reference: parsed.data.transactionReference || null,
    currency: parsed.data.currency as "USD" | "EUR" | "GBP",
    amount: parsed.data.amount,
    description: parsed.data.description,
    supporting_info: { reason: parsed.data.reason },
    status: "pending",
  });

  if (error) return { ok: false, error: error.message };

  revalidatePath("/dashboard/refunds");
  return { ok: true, message: "Dispute filed. Your banker will respond shortly." };
}

/* ---------------------------------------------------------- *
 *  Officer decision — review / approve / reject / complete
 * ---------------------------------------------------------- */
export async function decideRefundClaim(input: unknown): Promise<ActionResult> {
  const admin = await requireAdmin();
  const parsed = RefundDecisionSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "Invalid decision" };

  if ((await isDemoMode()) || localAuthEnabled() || !supabaseConfigured()) {
    return { ok: true, message: DEMO_MSG };
  }

  const { id, decision, adminNote } = parsed.data;
  const service = createServiceClient();

  const { data: claim } = await service.from("refund_claims").select("*").eq("id", id).maybeSingle();
  if (!claim) return { ok: false, error: "Claim not found" };

  // Reject without a note isn't allowed — must justify.
  if (decision === "rejected" && !adminNote?.trim()) {
    return { ok: false, error: "A note is required when rejecting a claim." };
  }

  await service
    .from("refund_claims")
    .update({
      status: decision,
      admin_note: adminNote ?? (claim as { admin_note: string | null }).admin_note,
      processed_by_admin_id: admin.id,
    })
    .eq("id", id);

  await service.from("audit_logs").insert({
    admin_id: admin.id,
    user_id: (claim as { user_id: string | null }).user_id,
    action_type: `refund_${decision}`,
    currency: (claim as { currency: string | null }).currency,
    old_value: {
      status: (claim as { status: string }).status,
      amount: (claim as { amount: number }).amount,
    },
    new_value: { status: decision },
    note: adminNote ?? null,
    ip_address: await clientIp(),
  });

  revalidatePath("/admin/refunds");
  revalidatePath("/dashboard/refunds");
  return { ok: true, message: `Claim ${decision.replace("_", " ")}.` };
}
