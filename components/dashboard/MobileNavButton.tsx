"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Home } from "lucide-react";
import { YoutubeIcon, MusicNoteIcon } from "@/components/ui/icons";

interface NavItem {
  href: string;
  label: string;
}

export default function MobileNavButton({
  items,
  role,
}: {
  items: NavItem[];
  role: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-2xl shadow-emerald-500/40 flex items-center justify-center hover:scale-110 active:scale-95 transition-transform"
        aria-label="Toggle menu"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {isOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-[#050b1a]/95 backdrop-blur-xl pt-20 pb-24 overflow-y-auto">
          <div className="px-6 space-y-1">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-3 py-2">
              Main Menu
            </div>
            {items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`block px-4 py-3 rounded-xl text-base font-medium transition-colors ${
                  pathname === item.href
                    ? "bg-emerald-500/10 text-emerald-400"
                    : "text-slate-200 hover:bg-white/5"
                }`}
              >
                {item.label}
              </Link>
            ))}

            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-3 py-2 mt-6">
              Video Platforms
            </div>
            <Link
              href="/videos/youtube"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium text-slate-200 hover:bg-white/5"
            >
              <YoutubeIcon className="w-5 h-5 text-red-400" />
              YouTube Videos
            </Link>
            <Link
              href="/videos/tiktok"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium text-slate-200 hover:bg-white/5"
            >
              <MusicNoteIcon className="w-5 h-5 text-pink-400" />
              TikTok Videos
            </Link>

            <div className="pt-6 mt-6 border-t border-white/5">
              <Link
                href="/"
                onClick={() => setIsOpen(false)}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-base font-medium text-slate-300 hover:bg-white/5 transition-colors"
              >
                <Home className="w-5 h-5" />
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
