import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

type CookiePair = { name: string; value: string; options?: CookieOptions };

// Pages that do NOT require an authenticated session.
// /pending is intentionally not listed — the page calls requireUser() itself
// and forwards approved users to /dashboard and admins to /admin.
const PUBLIC_PATHS = ["/", "/login", "/register", "/auth/callback"];
const ADMIN_ROLES = ["super_admin", "finance_admin", "support_admin"] as const;

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // If Supabase isn't configured (preview / first-boot), let everything pass
  // through so the public marketing pages still render.
  if (!url || !key || url.includes("placeholder")) {
    return response;
  }

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (cookiesToSet: CookiePair[]) => {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options),
        );
      },
    },
  });

  let user: { id: string } | null = null;
  try {
    const { data } = await supabase.auth.getUser();
    user = data.user;
  } catch {
    return response;
  }

  const { pathname } = request.nextUrl;

  const isPublic =
    PUBLIC_PATHS.includes(pathname) ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname.startsWith("/api/health");

  // 1. Unauthenticated user trying to access a protected area
  if (!user && !isPublic) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }

  // 2. Authenticated user — check role + status for protected areas
  if (user && (pathname.startsWith("/dashboard") || pathname.startsWith("/admin"))) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role, account_status")
      .eq("id", user.id)
      .maybeSingle();

    if (!profile) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }

    if (pathname.startsWith("/admin")) {
      if (!ADMIN_ROLES.includes(profile.role as (typeof ADMIN_ROLES)[number])) {
        const url = request.nextUrl.clone();
        url.pathname = "/dashboard";
        return NextResponse.redirect(url);
      }
    } else if (pathname.startsWith("/dashboard")) {
      if (profile.account_status !== "approved") {
        const url = request.nextUrl.clone();
        url.pathname = "/pending";
        return NextResponse.redirect(url);
      }
    }
  }

  // 3. Authenticated user landing on auth pages → forward into the app
  if (user && (pathname === "/login" || pathname === "/register")) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role, account_status")
      .eq("id", user.id)
      .maybeSingle();

    const url = request.nextUrl.clone();
    if (profile && ADMIN_ROLES.includes(profile.role as (typeof ADMIN_ROLES)[number])) {
      url.pathname = "/admin";
    } else if (profile?.account_status === "approved") {
      url.pathname = "/dashboard";
    } else {
      url.pathname = "/pending";
    }
    return NextResponse.redirect(url);
  }

  return response;
}
