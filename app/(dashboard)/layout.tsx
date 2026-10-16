import Link from "next/link";
import type { ReactNode } from "react";
import MobileNavButton from "@/components/dashboard/MobileNavButton";
import {
  LayoutDashboard, Users, Wallet, Video, Settings, LogOut,
  Zap, TrendingUp, Gift, BarChart3
} from "lucide-react";
import { YoutubeIcon, MusicNoteIcon } from "@/components/ui/icons";

const NAV = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/videos", label: "Watch & Earn", icon: Video, badge: "NEW" },
  { href: "/referrals", label: "Referrals", icon: Users },
  { href: "/referrals/invite", label: "Invite Friends", icon: Gift },
  { href: "/earnings", label: "Earnings", icon: TrendingUp },
  { href: "/payouts", label: "Payouts", icon: Wallet },
  { href: "/settings", label: "Settings", icon: Settings },
];

// Demo user for public access (no auth required)
const DEMO_USER = {
  email: "guest@earneasy.co.ke",
  role: "user" as const,
};

export default function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = DEMO_USER;

  return (
    <div className="min-h-screen flex bg-[#050b1a]">
      {/* Premium Sidebar */}
      <aside className="w-72 bg-[#0a1128] border-r border-white/5 hidden md:flex flex-col fixed h-screen">
        {/* Logo */}
        <div className="p-6 border-b border-white/5">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/30 group-hover:shadow-emerald-500/50 transition-shadow">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="font-bold text-lg text-white tracking-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                Earn<span className="text-emerald-400">Easy</span>
              </div>
              <div className="text-xs text-slate-500">Public Demo Mode</div>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-3 py-2">
            Main Menu
          </div>
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-300 hover:bg-emerald-500/10 hover:text-emerald-400 transition-all"
            >
              <item.icon className="w-[18px] h-[18px]" />
              <span className="flex-1">{item.label}</span>
              {item.badge && (
                <span className="text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                  {item.badge}
                </span>
              )}
            </Link>
          ))}

          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-3 py-2 mt-6">
            Video Platforms
          </div>
          <Link href="/videos/youtube" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-300 hover:bg-red-500/10 hover:text-red-400 transition-all">
            <YoutubeIcon className="w-[18px] h-[18px] text-red-400" />
            <span>YouTube Videos</span>
          </Link>
          <Link href="/videos/tiktok" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-300 hover:bg-pink-500/10 hover:text-pink-400 transition-all">
            <MusicNoteIcon className="w-[18px] h-[18px] text-pink-400" />
            <span>TikTok Videos</span>
          </Link>
          <Link href="/videos/earnings" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-300 hover:bg-cyan-500/10 hover:text-cyan-400 transition-all">
            <BarChart3 className="w-[18px] h-[18px] text-cyan-400" />
            <span>Video Earnings</span>
          </Link>
        </nav>

        {/* User Info */}
        <div className="p-4 border-t border-white/5">
          <div className="rounded-xl p-3 mb-3 bg-white/[0.03] backdrop-blur-sm border border-white/[0.08]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center text-white font-bold">
                G
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-white truncate">{session.email}</div>
                <div className="text-xs text-amber-400">Demo Mode</div>
              </div>
            </div>
          </div>
          <Link
            href="/"
            className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10 transition-all"
          >
            <LogOut className="w-4 h-4" />
            Back to Home
          </Link>
        </div>
      </aside>

      <MobileNavButton
        items={NAV.map(({ href, label }) => ({ href, label }))}
      />

      <main className="flex-1 md:ml-72 min-h-screen">
        <div className="max-w-7xl mx-auto p-6 md:p-10">
          {children}
        </div>
      </main>
    </div>
  );
}
