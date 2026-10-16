"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Wallet, TrendingUp, Users, Video, ArrowUpRight, ArrowDownRight,
  Gift, Zap, Clock, CheckCircle2, PlayCircle
} from "lucide-react";

export default function DashboardPage() {
  const [videoBalance, setVideoBalance] = useState(0);
  const [videosWatched, setVideosWatched] = useState(0);

  useEffect(() => {
    const stored = localStorage.getItem("earneasy_video_balance");
    const watched = localStorage.getItem("earneasy_videos_watched");
    if (stored) setVideoBalance(parseInt(stored) || 0);
    if (watched) setVideosWatched(parseInt(watched) || 0);
  }, []);

  // Demo referral balance (would come from API in production)
  const referralBalance = 2500;
  const referralCount = 10;
  const totalEarnings = videoBalance + referralBalance;

  const stats = [
    {
      label: "Video Bonus Balance",
      value: `KES ${videoBalance.toLocaleString()}`,
      sub: `${videosWatched} videos watched × KES 50`,
      icon: Video,
      gradient: "from-cyan-500 to-blue-600",
      glow: "shadow-cyan-500/30",
      href: "/videos/earnings",
    },
    {
      label: "Referral Balance",
      value: `KES ${referralBalance.toLocaleString()}`,
      sub: `${referralCount} active referrals`,
      icon: Users,
      gradient: "from-emerald-500 to-teal-600",
      glow: "shadow-emerald-500/30",
      href: "/referrals",
    },
    {
      label: "Total Earnings",
      value: `KES ${totalEarnings.toLocaleString()}`,
      sub: "Video bonus + Referrals",
      icon: Wallet,
      gradient: "from-purple-500 to-pink-600",
      glow: "shadow-purple-500/30",
      href: "/earnings",
    },
    {
      label: "Today's Progress",
      value: `${Math.min(videosWatched, 10)}/10`,
      sub: "Daily video target",
      icon: TrendingUp,
      gradient: "from-amber-500 to-orange-600",
      glow: "shadow-amber-500/30",
      href: "/videos",
    },
  ];

  const recentActivity = [
    { type: "video", title: "Watched YouTube Video #1", amount: "+KES 50", time: "2 min ago", icon: PlayCircle, color: "text-red-400" },
    { type: "referral", title: "New referral: John K.", amount: "+KES 250", time: "1 hour ago", icon: Users, color: "text-emerald-400" },
    { type: "video", title: "Watched TikTok Video #3", amount: "+KES 50", time: "3 hours ago", icon: PlayCircle, color: "text-pink-400" },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Welcome back 👋
          </h1>
          <p className="text-slate-400 mt-1">Here&apos;s your earning overview for today</p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/videos"
            className="btn-shine px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold text-sm shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all flex items-center gap-2"
          >
            <PlayCircle className="w-4 h-4" />
            Watch & Earn
          </Link>
          <Link
            href="/referrals/invite"
            className="px-5 py-2.5 rounded-xl border border-white/10 bg-white/5 text-white font-semibold text-sm hover:bg-white/10 transition-all flex items-center gap-2"
          >
            <Gift className="w-4 h-4" />
            Invite
          </Link>
        </div>
      </motion.div>

      {/* Balance Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
          >
            <Link href={stat.href} className="block">
              <div className="balance-card glass rounded-2xl p-5 card-hover group cursor-pointer">
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-lg ${stat.glow} group-hover:scale-110 transition-transform`}>
                    <stat.icon className="w-5 h-5 text-white" />
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                </div>
                <div className="text-xs text-slate-500 uppercase tracking-wider font-medium mb-1">
                  {stat.label}
                </div>
                <div className="text-2xl font-bold text-white mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  {stat.value}
                </div>
                <div className="text-xs text-slate-400">{stat.sub}</div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Two-Column Layout */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="lg:col-span-2 glass rounded-2xl p-6"
        >
          <h2 className="text-lg font-bold text-white mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Quick Actions
          </h2>
          <div className="grid sm:grid-cols-2 gap-3">
            <Link href="/videos/youtube" className="group glass rounded-xl p-4 card-hover flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center shadow-lg shadow-red-500/30">
                <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </div>
              <div className="flex-1">
                <div className="font-semibold text-white group-hover:text-red-400 transition-colors">YouTube Videos</div>
                <div className="text-xs text-slate-400">Earn KES 50 per video</div>
              </div>
            </Link>

            <Link href="/videos/tiktok" className="group glass rounded-xl p-4 card-hover flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center shadow-lg shadow-pink-500/30">
                <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5.8 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.84-.1z"/>
                </svg>
              </div>
              <div className="flex-1">
                <div className="font-semibold text-white group-hover:text-pink-400 transition-colors">TikTok Videos</div>
                <div className="text-xs text-slate-400">Earn KES 50 per video</div>
              </div>
            </Link>

            <Link href="/referrals/invite" className="group glass rounded-xl p-4 card-hover flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/30">
                <Gift className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <div className="font-semibold text-white group-hover:text-emerald-400 transition-colors">Invite Friends</div>
                <div className="text-xs text-slate-400">Earn KES 250 per referral</div>
              </div>
            </Link>

            <Link href="/payouts" className="group glass rounded-xl p-4 card-hover flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/30">
                <Wallet className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <div className="font-semibold text-white group-hover:text-amber-400 transition-colors">Request Payout</div>
                <div className="text-xs text-slate-400">Withdraw to M-Pesa</div>
              </div>
            </Link>
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="glass rounded-2xl p-6"
        >
          <h2 className="text-lg font-bold text-white mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Recent Activity
          </h2>
          <div className="space-y-3">
            {recentActivity.map((activity, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors">
                <div className={`w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center ${activity.color}`}>
                  <activity.icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-white truncate">{activity.title}</div>
                  <div className="text-xs text-slate-500 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {activity.time}
                  </div>
                </div>
                <div className="text-sm font-bold text-emerald-400">{activity.amount}</div>
              </div>
            ))}
          </div>
          <Link href="/earnings" className="mt-4 flex items-center justify-center gap-1 text-sm text-emerald-400 hover:text-emerald-300 font-medium">
            View all activity <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </motion.div>
      </div>

      {/* Video Bonus Highlight */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="relative rounded-2xl overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 via-blue-700 to-purple-700" />
        <div className="absolute inset-0 bg-grid opacity-10" />
        <div className="relative p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center">
              <Video className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                Watch Videos, Earn KES 50 Each
              </h3>
              <p className="text-white/70 text-sm mt-1">
                Complete daily video tasks on YouTube & TikTok to grow your bonus balance
              </p>
            </div>
          </div>
          <Link
            href="/videos"
            className="btn-shine px-6 py-3 rounded-xl bg-white text-blue-700 font-bold shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2"
          >
            Start Watching
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
