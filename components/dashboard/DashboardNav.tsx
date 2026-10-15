"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

const NAV = [
  { href: "/dashboard", label: "Home" },
  { href: "/referrals", label: "Referrals" },
  { href: "/referrals/invite", label: "Invite" },
  { href: "/earnings", label: "Earnings" },
  { href: "/payouts", label: "Payouts" },
  { href: "/settings", label: "Settings" },
];

export default function DashboardNav() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden flex overflow-x-auto gap-1 border-b bg-white px-2">
      {NAV.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={clsx(
            "whitespace-nowrap px-3 py-2 text-sm font-medium border-b-2 -mb-px",
            pathname === item.href
              ? "border-emerald-600 text-emerald-700"
              : "border-transparent text-slate-600"
          )}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}