import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SESSION_COOKIE_NAME, verifySessionToken } from "@/lib/auth-token";

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  if (pathname === "/login") {
    return NextResponse.next();
  }

  const secret = process.env.AUTH_SECRET;
  const user = process.env.AUTH_USERNAME;
  const pass = process.env.AUTH_PASSWORD;

  if (!secret || !user || !pass) {
    return new NextResponse(
      "Configuración incompleta: defina AUTH_SECRET, AUTH_USERNAME y AUTH_PASSWORD.",
      { status: 500, headers: { "content-type": "text/plain; charset=utf-8" } },
    );
  }

  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const valid = await verifySessionToken(token, secret);
  if (!valid) {
    const res = NextResponse.redirect(new URL("/login", request.url));
    res.cookies.delete(SESSION_COOKIE_NAME);
    return res;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!login|_next/static|_next/image|favicon.ico).*)"],
};
