import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * Supabase email-confirmation / magic-link callback.
 * After exchanging the code, we route the user appropriately based on role/status.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next");

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) {
      return NextResponse.redirect(`${origin}/login?error=callback`);
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.redirect(`${origin}/login`);

    const { data: profile } = await supabase
      .from("profiles")
      .select("role, account_status")
      .eq("id", user.id)
      .maybeSingle();

    const isAdmin =
      profile && ["super_admin", "finance_admin", "support_admin"].includes(profile.role);
    const target =
      next ??
      (isAdmin
        ? "/admin"
        : profile?.account_status === "approved"
          ? "/dashboard"
          : "/pending");
    return NextResponse.redirect(`${origin}${target}`);
  }

  return NextResponse.redirect(`${origin}/login`);
}
