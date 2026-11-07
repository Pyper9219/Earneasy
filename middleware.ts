<<<<<<< HEAD
﻿import { NextRequest, NextResponse } from "next/server";

// Authentication disabled - all routes are public
export async function middleware(req: NextRequest) {
=======
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getSessionFromRequest } from "./lib/auth/middleware";

const protectedPaths = ["/dashboard", "/admin"];
const adminPaths = ["/admin"];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isProtected = protectedPaths.some((path) => pathname.startsWith(path));
  const isAdminPath = adminPaths.some((path) => pathname.startsWith(path));

  if (!isProtected) {
    return NextResponse.next();
  }

  const session = await getSessionFromRequest(req);

  if (!session) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isAdminPath && session.role !== "admin") {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

>>>>>>> 33073f7 (Initial commit)
  return NextResponse.next();
}

export const config = {
<<<<<<< HEAD
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
=======
  matcher: ["/dashboard/:path*", "/admin/:path*"],
>>>>>>> 33073f7 (Initial commit)
};
