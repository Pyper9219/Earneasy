"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Video, Wallet, TrendingUp } from "lucide-react";
import { YoutubeIcon, MusicNoteIcon } from "@/components/ui/icons";

export default function VideoEarningsPage() {
  const [videoBalance, setVideoBalance] = useState(0);
  const [watchedYoutube, setWatchedYoutube] = useState<string[]>([]);
  const [watchedTiktok, setWatchedTiktok] = useState<string[]>([]);

  useEffect(() => {
    const balance = localStorage.getItem("earneasy_video_balance");
    const yt = localStorage.getItem("earneasy_watched_youtube");
    const tt = localStorage.getItem("earneasy_watched_tiktok");
    if (balance) setVideoBalance(parseInt(balance) || 0);
    if (yt) setWatchedYoutube(JSON.parse(yt));
    if (tt) setWatchedTiktok(JSON.parse(tt));
  }, []);

  const totalWatched = watchedYoutube.length + watchedTiktok.length;
  const youtubeEarnings = watchedYoutube.length * 50;
  const tiktokEarnings = watchedTiktok.length * 50;

  const stats = [
    { label: "Total Video Balance", value: `KES ${videoBalance.toLocaleString()}`, icon: Wallet, gradient: "from-emerald-500 to-teal-600" },
    { label: "YouTube Earnings", value: `KES ${youtubeEarnings.toLocaleString()}`, icon: YoutubeIcon, gradient: "from-red-500 to-red-600", sub: `${watchedYoutube.length} videos` },
    { label: "TikTok Earnings", value: `KES ${tiktokEarnings.toLocaleString()}`, icon: MusicNoteIcon, gradient: "from-pink-500 to-purple-600", sub: `${watchedTiktok.length} videos` },
    { label: "Total Watched", value: `${totalWatched}`, icon: Video, gradient: "from-cyan-500 to-blue-600", sub: "videos completed" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <Link href="/videos" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-emerald-400 mb-4 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Videos
        </Link>
        <h1 className="text-2xl font-bold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          Video Earnings Breakdown
        </h1>
        <p className="text-slate-400 mt-1">Track your video bonus balance separately from referral earnings</p>
      </div>

      {/* Main Balance Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative rounded-2xl overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-600 via-blue-700 to-purple-700" />
        <div className="absolute inset-0 bg-grid opacity-10" />
        <div className="relative p-8">
          <div className="flex items-center gap-2 mb-2">
            <Wallet className="w-5 h-5 text-cyan-200" />
            <span className="text-sm text-cyan-200">Video Bonus Balance</span>
          </div>
          <div className="text-5xl font-bold text-white mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            KES {videoBalance.toLocaleString()}
          </div>
          <div className="text-sm text-cyan-200/80">
            Earned from {totalWatched} videos × KES 50 each
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/videos/youtube" className="px-4 py-2 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white text-sm font-medium hover:bg-white/20 transition-all">
              Watch More YouTube
            </Link>
            <Link href="/videos/tiktok" className="px-4 py-2 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white text-sm font-medium hover:bg-white/20 transition-all">
              Watch More TikTok
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
            className="glass rounded-2xl p-5"
          >
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center mb-3 shadow-lg`}>
              <stat.icon className="w-5 h-5 text-white" />
            </div>
            <div className="text-xs text-slate-500 uppercase tracking-wider font-medium mb-1">{stat.label}</div>
            <div className="text-xl font-bold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{stat.value}</div>
            {stat.sub && <div className="text-xs text-slate-400 mt-1">{stat.sub}</div>}
          </motion.div>
        ))}
      </div>

      {/* Important Note */}
      <div className="glass rounded-2xl p-6 border-l-4 border-l-amber-500">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center flex-shrink-0">
            <TrendingUp className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h3 className="font-semibold text-white mb-1">Video Bonus vs Referral Balance</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Your <span className="text-cyan-400 font-medium">Video Bonus Balance</span> (shown above) comes from watching videos and is separate from your{" "}
              <span className="text-emerald-400 font-medium">Referral Balance</span> which holds real money earned from referring other users.
              Both balances can be withdrawn to your M-Pesa.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
