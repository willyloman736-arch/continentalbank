import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Profile } from "@/lib/types/database";

export type AuthedUser = {
  id: string;
  email: string | null;
  profile: Profile;
};

const ADMIN_ROLES = ["super_admin", "finance_admin", "support_admin"] as const;

export async function getAuthedUser(): Promise<AuthedUser | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();
  if (!profile) return null;

  return { id: user.id, email: user.email ?? null, profile };
}

export async function requireUser(): Promise<AuthedUser> {
  const user = await getAuthedUser();
  if (!user) redirect("/login");
  return user;
}

export async function requireApprovedClient(): Promise<AuthedUser> {
  const user = await requireUser();
  if (user.profile.account_status !== "approved") redirect("/pending");
  return user;
}

export async function requireAdmin(): Promise<AuthedUser> {
  const user = await requireUser();
  if (!ADMIN_ROLES.includes(user.profile.role as (typeof ADMIN_ROLES)[number])) {
    redirect("/dashboard");
  }
  return user;
}

export async function requireSuperAdmin(): Promise<AuthedUser> {
  const user = await requireUser();
  if (user.profile.role !== "super_admin") redirect("/admin");
  return user;
}

export function isAdmin(role: string) {
  return ADMIN_ROLES.includes(role as (typeof ADMIN_ROLES)[number]);
}
