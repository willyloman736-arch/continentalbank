"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { isDemoMode } from "@/lib/demo";
import { PasswordChangeSchema, ProfileUpdateSchema } from "@/lib/validation";
import type { ActionResult } from "./withdrawals";

const DEMO_MSG = "Demo mode — your changes are simulated, nothing is saved.";

export async function updateProfile(input: unknown): Promise<ActionResult> {
  const user = await requireUser();
  const parsed = ProfileUpdateSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  if (await isDemoMode()) return { ok: true, message: DEMO_MSG };

  const supabase = await createClient();
  const { error } = await supabase
    .from("profiles")
    .update({
      full_name: parsed.data.fullName,
      phone: parsed.data.phone || null,
      country: parsed.data.country,
      preferred_language: parsed.data.preferredLanguage,
      preferred_currency: parsed.data.preferredCurrency,
    })
    .eq("id", user.id);

  if (error) return { ok: false, error: error.message };

  revalidatePath("/dashboard/profile");
  return { ok: true, message: "Profile updated." };
}

export async function changePassword(input: unknown): Promise<ActionResult> {
  await requireUser();
  const parsed = PasswordChangeSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  if (await isDemoMode()) return { ok: true, message: DEMO_MSG };

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password: parsed.data.newPassword });
  if (error) return { ok: false, error: error.message };

  return { ok: true, message: "Password updated." };
}
