import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifySessionToken, SESSION_COOKIE } from "@/lib/auth/session";
import type { ReactNode } from "react";
import MobileNavButton from "@/components/dashboard/MobileNavButton";

const NAV = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/referrals", label: "Referrals" },
  { href: "/referrals/invite", label: "Invite" },
  { href: "/earnings", label: "Earnings" },
  { href: "/payouts", label: "Payouts" },
  { href: "/settings", label: "Settings" },
];

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const token = cookies().get(SESSION_COOKIE)?.value;
  const session = token ? await verifySessionToken(token) : null;
  if (!session) redirect("/login");

  return (
    <div className="min-h-screen flex bg-slate-50">
      <aside className="w-64 bg-white border-r hidden md:flex flex-col">
        <div className="p-6 border-b">
          <Link href="/dashboard" className="text-xl font-bold text-emerald-600">
            EarnEasy
          </Link>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100"
            >
              {item.label}
            </Link>
          ))}
          {session.role === "admin" && (
            <Link
              href="/admin"
              className="block px-3 py-2 rounded-lg text-sm font-medium text-amber-700 hover:bg-amber-50"
            >
              Admin
            </Link>
          )}
        </nav>
        <form action="/api/auth/logout" method="post" className="p-4 border-t">
          <button
            type="submit"
            className="w-full text-sm text-slate-600 hover:text-red-600 text-left"
          >
            Sign out
          </button>
        </form>
      </aside>
      <MobileNavButton items={NAV} role={session.role} />
      <main className="flex-1 p-6 md:p-10">{children}</main>
    </div>
  );
}