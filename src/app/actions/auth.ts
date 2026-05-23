"use server";

import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { localAuthEnabled, supabaseAuthEnabled } from "@/lib/auth-mode";
import {
  createLocalAdminSession,
  createLocalClientSession,
  encodeLocalAuthSession,
  isLocalAdminCredential,
  localNameFromEmail,
  LOCAL_AUTH_COOKIE,
} from "@/lib/local-auth";
import { CURRENCIES, SUPPORTED_LOCALES_VALUES } from "@/lib/validation";

const SignUpSchema = z.object({
  fullName: z.string().min(2, "Full name is required").max(120),
  email: z.string().email("Enter a valid email"),
  password: z.string().min(8, "Use at least 8 characters"),
  phone: z.string().max(40).optional().or(z.literal("")),
  country: z.string().min(2).max(2),
  preferredLanguage: z.enum(SUPPORTED_LOCALES_VALUES),
  preferredCurrency: z.enum(CURRENCIES),
});

const SignInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export type SignUpResult =
  | { ok: true; redirectTo?: string }
  | { ok: false; error: string; fieldErrors?: Partial<Record<keyof z.infer<typeof SignUpSchema>, string>> };

export async function signUpAction(formData: FormData): Promise<SignUpResult> {
  const parsed = SignUpSchema.safeParse({
    fullName: formData.get("fullName"),
    email: formData.get("email"),
    password: formData.get("password"),
    phone: formData.get("phone") ?? "",
    country: formData.get("country"),
    preferredLanguage: formData.get("preferredLanguage"),
    preferredCurrency: formData.get("preferredCurrency"),
  });
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const k = issue.path[0]?.toString();
      if (k) fieldErrors[k] = issue.message;
    }
    return { ok: false, error: "Please review the highlighted fields.", fieldErrors };
  }

  if (localAuthEnabled()) {
    await setLocalAuthCookie(
      createLocalClientSession({
        fullName: parsed.data.fullName,
        email: parsed.data.email,
        phone: parsed.data.phone || null,
        country: parsed.data.country,
        preferredLanguage: parsed.data.preferredLanguage,
        preferredCurrency: parsed.data.preferredCurrency as "USD" | "EUR" | "GBP",
      }),
    );
    return { ok: true, redirectTo: "/dashboard/onboarding" };
  }

  const supabase = await createClient();
  const h = await headers();
  const origin = h.get("origin") ?? process.env.NEXT_PUBLIC_SITE_URL ?? "";

  const { error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
      data: {
        full_name: parsed.data.fullName,
        phone: parsed.data.phone || null,
        country: parsed.data.country,
        preferred_language: parsed.data.preferredLanguage,
        preferred_currency: parsed.data.preferredCurrency,
      },
    },
  });

  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

export type SignInResult =
  | { ok: true; redirectTo: string }
  | { ok: false; error: string };

export async function signInAction(formData: FormData): Promise<SignInResult> {
  const parsed = SignInSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) return { ok: false, error: "Enter your email and password." };

  if (localAuthEnabled()) {
    const email = parsed.data.email.trim().toLowerCase();
    const password = parsed.data.password;
    const session = isLocalAdminCredential(email, password)
      ? createLocalAdminSession()
      : createLocalClientSession({
          fullName: localNameFromEmail(email),
          email,
        });

    await setLocalAuthCookie(session);
    return { ok: true, redirectTo: session.profile.role === "client" ? "/dashboard" : "/admin" };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });
  if (error || !data.user) {
    return { ok: false, error: "We could not sign you in. Verify your credentials." };
  }

  // Record login history (best effort)
  try {
    const h = await headers();
    await supabase.from("login_history").insert({
      user_id: data.user.id,
      ip_address:
        h.get("x-forwarded-for")?.split(",")[0]?.trim() ?? h.get("x-real-ip") ?? null,
      device: null,
      browser: h.get("user-agent") ?? null,
      location: h.get("x-vercel-ip-city") ?? h.get("cf-ipcity") ?? null,
    });
  } catch {
    // non-fatal
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, account_status")
    .eq("id", data.user.id)
    .maybeSingle();

  const isAdmin =
    profile && ["super_admin", "finance_admin", "support_admin"].includes(profile.role);
  const redirectTo = isAdmin
    ? "/admin"
    : profile?.account_status === "approved"
      ? "/dashboard"
      : "/pending";

  return { ok: true, redirectTo };
}

export async function signOutAction() {
  // Clear demo session if present
  const cookieStore = await cookies();
  cookieStore.delete("cb_demo");
  cookieStore.delete(LOCAL_AUTH_COOKIE);

  // Real session (best effort — fine if Supabase isn't configured)
  if (supabaseAuthEnabled()) {
    try {
      const supabase = await createClient();
      await supabase.auth.signOut();
    } catch {
      // ignore
    }
  }
  redirect("/login");
}

async function setLocalAuthCookie(session: ReturnType<typeof createLocalClientSession>) {
  const cookieStore = await cookies();
  cookieStore.set(LOCAL_AUTH_COOKIE, encodeLocalAuthSession(session), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

/**
 * Demo entry — sets a cookie that puts the app into either "client" or
 * "officer" demo mode. Used when Supabase isn't yet configured so the
 * visitor can still explore the portal.
 */
export async function enterDemoAction(role: "client" | "officer") {
  const c = await cookies();
  c.set("cb_demo", role, {
    httpOnly: false,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24, // 24h
  });
  redirect(role === "officer" ? "/admin" : "/dashboard");
}
