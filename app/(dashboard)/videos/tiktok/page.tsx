"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, CheckCircle2, Music, ArrowLeft, Sparkles, ExternalLink } from "lucide-react";
import Link from "next/link";

const TIKTOK_VIDEOS = [
  { id: "tiktok-1", title: "Money Making Tips 2026", author: "@financeguru", likes: "1.2M", duration: "0:45" },
  { id: "tiktok-2", title: "Side Hustle Ideas Kenya", author: "@hustleke", likes: "856K", duration: "0:58" },
  { id: "tiktok-3", title: "M-Pesa Business Hacks", author: "@mpesaboss", likes: "2.1M", duration: "1:02" },
  { id: "tiktok-4", title: "Investing for Beginners", author: "@investsmart", likes: "654K", duration: "0:52" },
  { id: "tiktok-5", title: "Online Earning Secrets", author: "@earnonline", likes: "1.8M", duration: "0:38" },
  { id: "tiktok-6", title: "Passive Income Streams", author: "@passiveke", likes: "945K", duration: "1:15" },
  { id: "tiktok-7", title: "Digital Marketing Tips", author: "@marketpro", likes: "1.5M", duration: "0:49" },
  { id: "tiktok-8", title: "Freelancing in Kenya", author: "@freelanceke", likes: "723K", duration: "0:55" },
];

export default function TikTokPage() {
  const [watchedVideos, setWatchedVideos] = useState<string[]>([]);
  const [videoBalance, setVideoBalance] = useState(0);
  const [showReward, setShowReward] = useState(false);
  const [playingVideo, setPlayingVideo] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("earneasy_watched_tiktok");
    const balance = localStorage.getItem("earneasy_video_balance");
    if (stored) setWatchedVideos(JSON.parse(stored));
    if (balance) setVideoBalance(parseInt(balance) || 0);
  }, []);

  const markAsWatched = (videoId: string) => {
    if (watchedVideos.includes(videoId)) return;
    const newWatched = [...watchedVideos, videoId];
    setWatchedVideos(newWatched);
    localStorage.setItem("earneasy_watched_tiktok", JSON.stringify(newWatched));

    const newBalance = videoBalance + 50;
    setVideoBalance(newBalance);
    localStorage.setItem("earneasy_video_balance", newBalance.toString());

    const totalWatched = parseInt(localStorage.getItem("earneasy_videos_watched") || "0") + 1;
    localStorage.setItem("earneasy_videos_watched", totalWatched.toString());

    setShowReward(true);
    setTimeout(() => setShowReward(false), 3000);
    setPlayingVideo(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <Link href="/videos" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-emerald-400 mb-4 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Videos
        </Link>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center shadow-lg shadow-pink-500/30">
            <Music className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              TikTok Videos
            </h1>
            <p className="text-sm text-slate-400">Watch and earn KES 50 per video</p>
          </div>
        </div>
      </div>

      {/* Balance Banner */}
      <div className="relative rounded-2xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-pink-600 via-purple-700 to-pink-800" />
        <div className="absolute inset-0 bg-grid opacity-10" />
        <div className="relative p-6 flex items-center justify-between">
          <div>
            <div className="text-sm text-pink-200 mb-1">TikTok Bonus Balance</div>
            <div className="text-3xl font-bold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              KES {videoBalance.toLocaleString()}
            </div>
            <div className="text-xs text-pink-200 mt-1">{watchedVideos.length} videos watched</div>
          </div>
          <div className="text-right">
            <div className="text-sm text-pink-200">Per Video</div>
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
            className="fixed top-24 right-6 z-50 glass-strong rounded-xl p-4 border border-pink-500/30 shadow-2xl shadow-pink-500/20"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-pink-500/20 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-pink-400" />
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
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {TIKTOK_VIDEOS.map((video, i) => {
          const isWatched = watchedVideos.includes(video.id);
          const isPlaying = playingVideo === video.id;

          return (
            <motion.div
              key={video.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
              className="video-card glass rounded-2xl overflow-hidden"
            >
              {/* Thumbnail - vertical format */}
              <div className="relative aspect-[9/14] bg-gradient-to-br from-pink-900/50 to-purple-900/50 overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <Music className="w-12 h-12 text-pink-400/50 mx-auto mb-2" />
                    <div className="text-xs text-pink-300/70">{video.duration}</div>
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                {/* Top badges */}
                <div className="absolute top-2 left-2 right-2 flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-pink-500/30 text-pink-200 border border-pink-500/40 backdrop-blur-sm">
                    TikTok
                  </span>
                  {isWatched && (
                    <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center">
                      <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                    </div>
                  )}
                </div>

                {/* Bottom info */}
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <div className="text-xs text-pink-300 mb-1">{video.author}</div>
                  <div className="text-sm font-semibold text-white line-clamp-2 mb-2">{video.title}</div>
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <span>❤️ {video.likes}</span>
                    <span>•</span>
                    <span>{video.duration}</span>
                  </div>
                </div>

                {/* Play overlay */}
                {!isWatched && !isPlaying && (
                  <button
                    onClick={() => setPlayingVideo(video.id)}
                    className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/40 transition-colors"
                  >
                    <div className="w-14 h-14 rounded-full bg-pink-600 flex items-center justify-center shadow-xl hover:scale-110 transition-transform">
                      <Play className="w-6 h-6 text-white ml-1" fill="white" />
                    </div>
                  </button>
                )}
              </div>

              {/* Action */}
              <div className="p-3">
                {isWatched ? (
                  <div className="flex items-center gap-2 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-medium justify-center">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Watched — KES 50
                  </div>
                ) : isPlaying ? (
                  <div className="space-y-2">
                    <a
                      href={`https://www.tiktok.com`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2 rounded-lg bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold text-xs shadow-lg flex items-center justify-center gap-1.5"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      Watch on TikTok
                    </a>
                    <button
                      onClick={() => markAsWatched(video.id)}
                      className="w-full py-2 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 font-medium text-xs hover:bg-emerald-500/30 transition-all flex items-center justify-center gap-1.5"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      I Watched (+KES 50)
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setPlayingVideo(video.id)}
                    className="w-full py-2 rounded-lg border border-white/10 bg-white/5 text-white font-medium text-xs hover:bg-white/10 transition-all flex items-center justify-center gap-1.5"
                  >
                    <Play className="w-3.5 h-3.5" />
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
