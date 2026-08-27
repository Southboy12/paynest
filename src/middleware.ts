import { NextResponse, type NextRequest } from "next/server";

const PUBLIC_PATHS = ["/login", "/api/auth"];

function isPublicPath(pathname: string): boolean {
  return PUBLIC_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`),
  );
}

// Server-side route protection: every app route requires a valid,
// database-backed session. The session is validated by better-auth's
// get-session endpoint, so expired or revoked sessions are rejected too.
export async function middleware(request: NextRequest) {
  const { pathname, origin } = request.nextUrl;

  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }

  const cookie = request.headers.get("cookie");
  if (!cookie) {
    return NextResponse.redirect(new URL("/login", origin));
  }

  const response = await fetch(new URL("/api/auth/get-session", origin), {
    headers: { cookie },
    cache: "no-store",
  }).catch(() => null);

  const data = response?.ok
    ? await response.json().catch(() => null)
    : null;

  if (!data?.session) {
    return NextResponse.redirect(new URL("/login", origin));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|login).*)"],
};
