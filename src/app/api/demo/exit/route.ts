import { NextResponse, type NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const url = request.nextUrl.clone();
  url.pathname = "/";
  const res = NextResponse.redirect(url, { status: 303 });
  res.cookies.set("cb_demo", "", { path: "/", maxAge: 0 });
  return res;
}
