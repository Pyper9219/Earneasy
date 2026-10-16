"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, CheckCircle2, ArrowLeft, Sparkles } from "lucide-react";
import Link from "next/link";
import { YoutubeIcon } from "@/components/ui/icons";

const YOUTUBE_VIDEOS = [
  { id: "dQw4w9WgXcQ", title: "How to Build Wealth Online", duration: "10:24", category: "Finance" },
  { id: "jNQ3-YZSMPA", title: "M-Pesa Business Tips", duration: "8:15", category: "Business" },
  { id: "aqz-KE-bpKQ", title: "Passive Income Strategies", duration: "12:30", category: "Finance" },
  { id: "9bZkp7q19f0", title: "Digital Marketing 101", duration: "15:45", category: "Marketing" },
  { id: "3JZ_D3ELwOQ", title: "Side Hustles in Kenya", duration: "9:50", category: "Business" },
  { id: "LXb3EKWsInQ", title: "Investing for Beginners", duration: "11:20", category: "Finance" },
];

export default function YouTubePage() {
  const [watchedVideos, setWatchedVideos] = useState<string[]>([]);
  const [activeVideo, setActiveVideo] = useState<string | null>(null);
  const [videoBalance, setVideoBalance] = useState(0);
  const [showReward, setShowReward] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("earneasy_watched_youtube");
    const balance = localStorage.getItem("earneasy_video_balance");
    if (stored) setWatchedVideos(JSON.parse(stored));
    if (balance) setVideoBalance(parseInt(balance) || 0);
  }, []);

  const markAsWatched = (videoId: string) => {
    if (watchedVideos.includes(videoId)) return;
    const newWatched = [...watchedVideos, videoId];
    setWatchedVideos(newWatched);
    localStorage.setItem("earneasy_watched_youtube", JSON.stringify(newWatched));

    const newBalance = videoBalance + 50;
    setVideoBalance(newBalance);
    localStorage.setItem("earneasy_video_balance", newBalance.toString());

    const totalWatched = parseInt(localStorage.getItem("earneasy_videos_watched") || "0") + 1;
    localStorage.setItem("earneasy_videos_watched", totalWatched.toString());

    setShowReward(true);
    setTimeout(() => setShowReward(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Link href="/videos" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-emerald-400 mb-4 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Videos
        </Link>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center shadow-lg shadow-red-500/30">
            <YoutubeIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              YouTube Videos
            </h1>
            <p className="text-sm text-slate-400">Watch and earn KES 50 per video</p>
          </div>
        </div>
      </div>

      {/* Balance Banner */}
      <div className="relative rounded-2xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-red-800" />
        <div className="absolute inset-0 bg-grid opacity-10" />
        <div className="relative p-6 flex items-center justify-between">
          <div>
            <div className="text-sm text-red-200 mb-1">YouTube Bonus Balance</div>
            <div className="text-3xl font-bold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              KES {videoBalance.toLocaleString()}
            </div>
            <div className="text-xs text-red-200 mt-1">{watchedVideos.length} videos watched</div>
          </div>
          <div className="text-right">
            <div className="text-sm text-red-200">Per Video</div>
            <div className="text-2xl font-bold text-white">KES 50</div>
          </div>
        </div>
      </div>

      {/* Reward Toast */}
      <AnimatePresence>
        {showReward && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className="fixed top-24 right-6 z-50 rounded-xl p-4 border border-emerald-500/30 shadow-2xl shadow-emerald-500/20 bg-[#0a1128]/95 backdrop-blur-xl"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <div className="text-sm font-bold text-white">+KES 50 Earned!</div>
                <div className="text-xs text-slate-400">Added to your video balance</div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Video Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {YOUTUBE_VIDEOS.map((video, i) => {
          const isWatched = watchedVideos.includes(video.id);
          const isActive = activeVideo === video.id;

          return (
            <motion.div
              key={video.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
              className="rounded-2xl overflow-hidden bg-white/[0.03] backdrop-blur-sm border border-white/[0.08] hover:border-emerald-500/30 transition-all hover:-translate-y-1 hover:shadow-2xl"
            >
              {/* Thumbnail */}
              <div className="relative aspect-video bg-slate-900 overflow-hidden">
                <img
                  src={`https://img.youtube.com/vi/${video.id}/mqdefault.jpg`}
                  alt={video.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/80 text-xs text-white font-medium">
                  {video.duration}
                </div>
                {isWatched && (
                  <div className="absolute top-2 right-2 w-7 h-7 rounded-full bg-emerald-500 flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4 text-white" />
                  </div>
                )}
                {!isActive && !isWatched && (
                  <button
                    onClick={() => setActiveVideo(video.id)}
                    className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/50 transition-colors"
                  >
                    <div className="w-14 h-14 rounded-full bg-red-600 flex items-center justify-center shadow-xl hover:scale-110 transition-transform">
                      <Play className="w-6 h-6 text-white ml-1" fill="white" />
                    </div>
                  </button>
                )}
              </div>

              {/* Info */}
              <div className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/30">
                    {video.category}
                  </span>
                </div>
                <h3 className="text-sm font-semibold text-white mb-3 line-clamp-2">{video.title}</h3>

                {isActive && !isWatched ? (
                  <div className="space-y-3">
                    <div className="aspect-video rounded-lg overflow-hidden bg-black">
                      <iframe
                        width="100%"
                        height="100%"
                        src={`https://www.youtube.com/embed/${video.id}?autoplay=1`}
                        title={video.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="w-full h-full"
                      />
                    </div>
                    <button
                      onClick={() => markAsWatched(video.id)}
                      className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold text-sm shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all flex items-center justify-center gap-2"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      Mark as Watched (+KES 50)
                    </button>
                  </div>
                ) : isWatched ? (
                  <div className="flex items-center gap-2 py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm font-medium justify-center">
                    <CheckCircle2 className="w-4 h-4" />
                    Watched — KES 50 earned
                  </div>
                ) : (
                  <button
                    onClick={() => setActiveVideo(video.id)}
                    className="w-full py-2.5 rounded-xl border border-white/10 bg-white/5 text-white font-medium text-sm hover:bg-white/10 transition-all flex items-center justify-center gap-2"
                  >
                    <Play className="w-4 h-4" />
                    Watch Video
                  </button>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
