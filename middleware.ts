import { NextRequest, NextResponse } from "next/server";

/**
 * Edge rate limiting for the API.
 * 30 requests/minute for auth endpoints, 120/minute for everything else, per IP.
 * The per-account login lockout lives in the login route.
 */
const buckets = new Map<string, { count: number; resetAt: number }>();

function hit(key: string, limit: number, windowMs: number) {
  const now = Date.now();
  const entry = buckets.get(key);

  if (!entry || entry.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, retryAfter: 0 };
  }

  if (entry.count >= limit) {
    return {
      ok: false,
      retryAfter: Math.max(1, Math.ceil((entry.resetAt - now) / 1000)),
    };
  }

  entry.count += 1;
  return { ok: true, retryAfter: 0 };
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/api/")) {
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "unknown";

    const isAuth = pathname.startsWith("/api/auth/");
    const limit = isAuth ? 30 : 120;
    const result = hit(`${ip}:${isAuth ? "auth" : "api"}`, limit, 60_000);

    if (!result.ok) {
      return NextResponse.json(
        { error: "Too many requests. Please slow down." },
        {
          status: 429,
          headers: { "Retry-After": String(result.retryAfter) },
        }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
