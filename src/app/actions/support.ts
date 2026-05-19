"use server";

import { revalidatePath } from "next/cache";
import { requireApprovedClient } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { isDemoMode } from "@/lib/demo";
import { SupportTicketSchema } from "@/lib/validation";
import type { ActionResult } from "./withdrawals";

export async function openTicket(input: unknown): Promise<ActionResult> {
  const user = await requireApprovedClient();
  const parsed = SupportTicketSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid ticket" };
  }

  if (await isDemoMode()) {
    return { ok: true, message: "Demo mode — ticket simulated, nothing saved." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("support_tickets").insert({
    user_id: user.id,
    subject: parsed.data.subject,
    message: parsed.data.message,
    status: "open",
  });

  if (error) return { ok: false, error: error.message };

  revalidatePath("/dashboard/support");
  return { ok: true, message: "Ticket opened. We will reply shortly." };
}
