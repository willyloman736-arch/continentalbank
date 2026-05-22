import { NextResponse, type NextRequest } from "next/server";
import { DEMO_FROZEN_COOKIE } from "@/lib/demo";

/**
 * Toggle the frozen-account preview while in demo mode.
 *
 *   POST /api/demo/frozen?on=1  → set cookie, dashboard renders frozen
 *   POST /api/demo/frozen?off=1 → clear cookie, dashboard renders normal
 *
 * Always 303-redirects back to /dashboard.
 */
export async function POST(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const on = searchParams.get("on") === "1";
  const off = searchParams.get("off") === "1";

  const url = request.nextUrl.clone();
  url.pathname = "/dashboard";
  url.search = "";
  const res = NextResponse.redirect(url, { status: 303 });

  if (off) {
    res.cookies.set(DEMO_FROZEN_COOKIE, "", { path: "/", maxAge: 0 });
  } else if (on) {
    res.cookies.set(DEMO_FROZEN_COOKIE, "1", {
      path: "/",
      maxAge: 60 * 60 * 24,
      sameSite: "lax",
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
    });
  }
  return res;
}
