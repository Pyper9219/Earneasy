"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  LogOut,
  Home,
  LayoutDashboard,
  Video,
  MessageCircle,
  Users,
  Gift,
  TrendingUp,
  Wallet,
  Settings,
  Shield,
} from "lucide-react";

export interface MobileNavItem {
  href: string;
  label: string;
  badge?: string;
}

const ICONS: Record<string, typeof Home> = {
  "/dashboard": LayoutDashboard,
  "/videos": Video,
  "/chat": MessageCircle,
  "/referrals": Users,
  "/referrals/invite": Gift,
  "/earnings": TrendingUp,
  "/payouts": Wallet,
  "/settings": Settings,
};

/** Mobile drawer: every sidebar destination plus sign out, which phones could not reach before. */
export default function MobileNav({
  items,
  email,
  isAdmin,
}: {
  items: MobileNavItem[];
  email: string;
  isAdmin: boolean;
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="md:hidden fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-2xl shadow-emerald-500/40 flex items-center justify-center active:scale-95 transition-transform"
        aria-label="Open menu"
      >
        <Menu className="w-6 h-6" />
      </button>

      {open && (
        <div className="md:hidden fixed inset-0 z-[55] bg-[#050b1a]/97 backdrop-blur-xl overflow-y-auto">
          <div className="flex items-center justify-between px-5 pt-5 pb-3">
            <div className="min-w-0">
              <div className="text-sm font-semibold text-white truncate">{email}</div>
              <div className="text-xs text-emerald-400">
                {isAdmin ? "Admin" : "Member"}
              </div>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="w-10 h-10 rounded-full bg-white/5 text-slate-300 flex items-center justify-center"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <nav className="px-3 pb-8 space-y-1">
            {items.map((item) => {
              const Icon = ICONS[item.href] ?? Home;
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-colors ${
                    active
                      ? "bg-emerald-500/10 text-emerald-400"
                      : "text-slate-200 hover:bg-white/5"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="flex-1">{item.label}</span>
                  {item.badge && (
                    <span className="text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}

            {isAdmin && (
              <Link
                href="/admin/payouts"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium text-amber-300 hover:bg-amber-500/10"
              >
                <Shield className="w-5 h-5" />
                Admin Panel
              </Link>
            )}

            <div className="pt-4 mt-4 border-t border-white/10 space-y-1">
              <Link
                href="/"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium text-slate-300 hover:bg-white/5"
              >
                <Home className="w-5 h-5" />
                Back to Home
              </Link>

              <form action="/api/auth/logout" method="post">
                <button
                  type="submit"
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium text-rose-300 hover:bg-rose-500/10"
                >
                  <LogOut className="w-5 h-5" />
                  Sign out
                </button>
              </form>
            </div>
          </nav>
        </div>
      )}
    </>
  );
}
