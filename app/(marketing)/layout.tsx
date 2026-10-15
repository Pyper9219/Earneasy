import Navbar from "@/components/Navbar";
import type { ReactNode } from "react";

export default function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-[#0B1326] text-white">
      <Navbar />
      <main className="flex-1">{children}</main>
      <footer className="border-t border-white/10 py-6 text-center text-sm text-slate-400">
        © {new Date().getFullYear()} EarnEasy. All rights reserved.
      </footer>
    </div>
  );
}