import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { verifySessionToken, SESSION_COOKIE } from "@/lib/auth/session";
import { connectDB } from "@/lib/db/connect";
import { User } from "@/lib/db/models/User";
import { isAdminSession } from "@/lib/auth/admin";
import IdleLogout from "@/components/auth/IdleLogout";

export const dynamic = "force-dynamic";

const NAV = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/payouts", label: "Payout Approvals" },
  { href: "/admin/commission-config", label: "Commission" },
  { href: "/admin/referral-tree", label: "Referral Tree" },
];

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const token = cookies().get(SESSION_COOKIE)?.value;
  const session = token ? await verifySessionToken(token) : null;

  if (!session) redirect("/login?next=/admin");

  await connectDB();
  const account = await User.findById(session.userId)
    .select("role email name")
    .lean<{ role?: string; email?: string; name?: string } | null>();

  if (!account || !isAdminSession({ role: account.role, email: account.email })) {
    redirect("/dashboard");
  }

  return (
    <div className="dashboard-shell min-h-screen bg-[#050b1a] text-slate-200">
      <IdleLogout />
      <header className="border-b border-white/10 bg-[#0a1128]">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-wrap items-center gap-6">
          <div>
            <div className="text-xs uppercase tracking-wider text-emerald-400 font-semibold">
              EarnEasy Admin
            </div>
            <div className="text-sm text-slate-400">{account.email}</div>
          </div>
          <nav className="flex flex-wrap gap-1 ml-auto">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="px-3 py-2 rounded-lg text-sm text-slate-300 hover:bg-emerald-500/10 hover:text-emerald-400 transition"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/dashboard"
              className="px-3 py-2 rounded-lg text-sm text-slate-400 hover:text-white transition"
            >
              Back to app
            </Link>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6 md:p-10">{children}</main>
    </div>
  );
}
