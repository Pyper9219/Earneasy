import Link from "next/link";
import { BarChart3, Sparkles } from "lucide-react";
import { YoutubeIcon, TikTokIcon } from "@/components/ui/icons";

export default function VideosPage() {
  const platforms = [
    {
      name: "YouTube Videos",
      description: "Watch curated YouTube videos and earn KES 50 per video completed.",
      icon: YoutubeIcon,
      gradient: "from-red-500 to-red-600",
      glow: "shadow-red-500/30",
      href: "/videos/youtube",
      videoCount: "12 videos available",
      earnings: "KES 50 / video",
    },
    {
      name: "TikTok Videos",
      description: "Watch trending TikTok content and earn KES 50 per video completed.",
      icon: TikTokIcon,
      gradient: "from-pink-500 to-purple-600",
      glow: "shadow-pink-500/30",
      href: "/videos/tiktok",
      videoCount: "15 videos available",
      earnings: "KES 50 / video",
    },
    {
      name: "Video Earnings",
      description: "Track your video bonus balance and watch history.",
      icon: BarChart3,
      gradient: "from-cyan-500 to-blue-600",
      glow: "shadow-cyan-500/30",
      href: "/videos/earnings",
      videoCount: "View breakdown",
      earnings: "Total earned",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-sm text-emerald-400 font-medium mb-4">
          <Sparkles className="w-3.5 h-3.5" />
          Watch & Earn
        </div>
        <h1 className="text-3xl font-bold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          Video Earning Hub
        </h1>
        <p className="text-slate-400 mt-2">
          Watch videos on YouTube and TikTok to earn <span className="text-emerald-400 font-semibold">KES 50</span> per video.
          Your video bonus balance is separate from your referral earnings.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {platforms.map((platform) => (
          <Link
            key={platform.name}
            href={platform.href}
            className="group rounded-2xl p-6 bg-white/[0.03] backdrop-blur-sm border border-white/[0.08] hover:border-emerald-500/30 transition-all hover:-translate-y-1 hover:shadow-2xl"
          >
            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${platform.gradient} flex items-center justify-center mb-5 shadow-lg ${platform.glow} group-hover:scale-110 transition-transform duration-300`}>
              <platform.icon className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-emerald-400 transition-colors" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              {platform.name}
            </h3>
            <p className="text-sm text-slate-400 mb-4">{platform.description}</p>
            <div className="flex items-center justify-between pt-4 border-t border-white/5">
              <span className="text-xs text-slate-500">{platform.videoCount}</span>
              <span className="text-sm font-bold text-emerald-400">{platform.earnings}</span>
            </div>
          </Link>
        ))}
      </div>

      {/* How it works */}
      <div className="rounded-2xl p-6 bg-white/[0.03] backdrop-blur-sm border border-white/[0.08]">
        <h2 className="text-lg font-bold text-white mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          How Video Earnings Work
        </h2>
        <div className="grid sm:grid-cols-3 gap-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center flex-shrink-0">
              <span className="text-sm font-bold text-emerald-400">1</span>
            </div>
            <div>
              <div className="text-sm font-semibold text-white">Choose a Platform</div>
              <div className="text-xs text-slate-400 mt-1">Pick YouTube or TikTok videos to watch</div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center flex-shrink-0">
              <span className="text-sm font-bold text-emerald-400">2</span>
            </div>
            <div>
              <div className="text-sm font-semibold text-white">Watch the Video</div>
              <div className="text-xs text-slate-400 mt-1">Complete the full video duration</div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center flex-shrink-0">
              <span className="text-sm font-bold text-emerald-400">3</span>
            </div>
            <div>
              <div className="text-sm font-semibold text-white">Earn KES 50</div>
              <div className="text-xs text-slate-400 mt-1">Bonus credited to your video balance</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
