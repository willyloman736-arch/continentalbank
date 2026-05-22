/**
 * Demo-mode helpers.
 *
 * Demo mode activates either:
 *  1. automatically when Supabase env vars are missing or placeholder, or
 *  2. on demand via the `cb_demo` cookie ("client" | "officer")
 *
 * In demo mode the auth helpers short-circuit and every page reads from
 * seed data instead of Supabase. Server actions return a no-op success.
 */

import { cookies } from "next/headers";
import { demoAdminProfile, demoClientProfile } from "./data";
import type { AuthedUser } from "@/lib/auth";
export { supabaseConfigured } from "@/lib/auth-mode";

export const DEMO_COOKIE = "cb_demo";
/** Optional cookie that puts the demo client into the frozen state for previews. */
export const DEMO_FROZEN_COOKIE = "cb_demo_frozen";
export type DemoRole = "client" | "officer";

/**
 * Server-only. Reads the demo cookie if present and returns the active role.
 * If Supabase isn't configured but no cookie is set, we still treat the user
 * as "anonymous" (the public site, login, register all render normally).
 */
export async function getDemoRole(): Promise<DemoRole | null> {
  const c = await cookies();
  const v = c.get(DEMO_COOKIE)?.value;
  if (v === "client" || v === "officer") return v;
  return null;
}

export async function isDemoMode(): Promise<boolean> {
  // The cookie is the trigger. We don't auto-enter demo mode without
  // explicit consent, so users hitting / still see the marketing site.
  const role = await getDemoRole();
  return role !== null;
}

/**
 * Has the visitor opted into the frozen-account preview?
 * Honoured only when demo mode is active.
 */
export async function isDemoFrozenPreview(): Promise<boolean> {
  const role = await getDemoRole();
  if (role !== "client") return false;
  const c = await cookies();
  return c.get(DEMO_FROZEN_COOKIE)?.value === "1";
}

export async function getDemoAuthedUser(role: DemoRole): Promise<AuthedUser> {
  const baseProfile = role === "officer" ? demoAdminProfile : demoClientProfile;

  // If the visitor toggled the frozen preview, present the demo client
  // as suspended so the dashboard renders in frozen mode.
  if (role === "client" && (await isDemoFrozenPreview())) {
    return {
      id: baseProfile.id,
      email: baseProfile.email,
      profile: { ...baseProfile, account_status: "suspended" },
    };
  }

  return {
    id: baseProfile.id,
    email: baseProfile.email,
    profile: baseProfile,
  };
}
