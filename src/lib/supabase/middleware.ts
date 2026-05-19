import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

type CookiePair = { name: string; value: string; options?: CookieOptions };

// Pages that do NOT require an authenticated session.
const PUBLIC_PATHS = ["/", "/login", "/register", "/auth/callback"];
const ADMIN_ROLES = ["super_admin", "finance_admin", "support_admin"] as const;
const DEMO_COOKIE = "cb_demo";

export async function updateSession(request: NextRequest) {
  const response = NextResponse.next({ request });
  const { pathname } = request.nextUrl;

  // --- Demo mode short-circuit ---------------------------------------
  // If the visitor has opted into demo mode, route them as if they were
  // authenticated. Officers → /admin, clients → /dashboard.
  const demoRole = request.cookies.get(DEMO_COOKIE)?.value;
  if (demoRole === "client" || demoRole === "officer") {
    if (pathname === "/login" || pathname === "/register") {
      const url = request.nextUrl.clone();
      url.pathname = demoRole === "officer" ? "/admin" : "/dashboard";
      return NextResponse.redirect(url);
    }
    if (pathname.startsWith("/admin") && demoRole !== "officer") {
      const url = request.nextUrl.clone();
      url.pathname = "/dashboard";
      return NextResponse.redirect(url);
    }
    return response;
  }

  // --- Supabase not configured? let everything pass through ---------
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key || url.includes("placeholder")) {
    // Only protect /admin and /dashboard so visitors land on /login first.
    if (pathname.startsWith("/admin") || pathname.startsWith("/dashboard")) {
      const u = request.nextUrl.clone();
      u.pathname = "/login";
      return NextResponse.redirect(u);
    }
    return response;
  }

  // --- Real Supabase session check ----------------------------------
  let responseRef = response;
  const supabase = createServerClient(url, key, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (cookiesToSet: CookiePair[]) => {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        responseRef = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          responseRef.cookies.set(name, value, options),
        );
      },
    },
  });

  let user: { id: string } | null = null;
  try {
    const { data } = await supabase.auth.getUser();
    user = data.user;
  } catch {
    return responseRef;
  }

  const isPublic =
    PUBLIC_PATHS.includes(pathname) ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname.startsWith("/api/health");

  if (!user && !isPublic) {
    const u = request.nextUrl.clone();
    u.pathname = "/login";
    u.searchParams.set("redirect", pathname);
    return NextResponse.redirect(u);
  }

  if (user && (pathname.startsWith("/dashboard") || pathname.startsWith("/admin"))) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role, account_status")
      .eq("id", user.id)
      .maybeSingle();

    if (!profile) {
      const u = request.nextUrl.clone();
      u.pathname = "/login";
      return NextResponse.redirect(u);
    }
    const role = (profile as { role: string }).role;
    const status = (profile as { account_status: string }).account_status;

    if (pathname.startsWith("/admin")) {
      if (!ADMIN_ROLES.includes(role as (typeof ADMIN_ROLES)[number])) {
        const u = request.nextUrl.clone();
        u.pathname = "/dashboard";
        return NextResponse.redirect(u);
      }
    } else if (pathname.startsWith("/dashboard")) {
      if (status !== "approved") {
        const u = request.nextUrl.clone();
        u.pathname = "/pending";
        return NextResponse.redirect(u);
      }
    }
  }

  if (user && (pathname === "/login" || pathname === "/register")) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role, account_status")
      .eq("id", user.id)
      .maybeSingle();

    const u = request.nextUrl.clone();
    const role = (profile as { role?: string } | null)?.role;
    const status = (profile as { account_status?: string } | null)?.account_status;
    if (role && ADMIN_ROLES.includes(role as (typeof ADMIN_ROLES)[number])) {
      u.pathname = "/admin";
    } else if (status === "approved") {
      u.pathname = "/dashboard";
    } else {
      u.pathname = "/pending";
    }
    return NextResponse.redirect(u);
  }

  return responseRef;
}
