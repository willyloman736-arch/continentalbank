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

export function getDemoAuthedUser(role: DemoRole): AuthedUser {
  const profile = role === "officer" ? demoAdminProfile : demoClientProfile;
  return {
    id: profile.id,
    email: profile.email,
    profile,
  };
}
