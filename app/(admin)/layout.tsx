import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifySessionToken, SESSION_COOKIE } from "@/lib/auth/session";
import type { ReactNode } from "react";

const NAV = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/referral-tree", label: "Referral Tree" },
  { href: "/admin/payouts", label: "Payouts" },
  { href: "/admin/commission-config", label: "Commission Config" },
];

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const token = cookies().get(SESSION_COOKIE)?.value;
  const session = token ? await verifySessionToken(token) : null;
  if (!session) redirect("/login");
  if (session.role !== "admin") redirect("/dashboard");

  return (
    <div className="min-h-screen flex bg-slate-50">
      <aside className="w-64 bg-slate-900 text-white hidden md:flex flex-col">
        <div className="p-6 border-b border-slate-800">
          <Link href="/admin" className="text-xl font-bold text-emerald-400">
            EarnEasy Admin
          </Link>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-300 hover:bg-slate-800"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/dashboard"
            className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-400 hover:bg-slate-800"
          >
            ← User Dashboard
          </Link>
        </nav>
      </aside>
      <main className="flex-1 p-6 md:p-10">{children}</main>
    </div>
  );
}