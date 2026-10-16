import Navbar from "@/components/Navbar";
import type { ReactNode } from "react";
import { Zap } from "lucide-react";
import Link from "next/link";

export default function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-[#050b1a] text-slate-200">
      <Navbar />
      <main className="flex-1">{children}</main>
      <footer className="relative border-t border-white/5 py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            <div className="sm:col-span-2 lg:col-span-1">
              <Link href="/" className="flex items-center gap-2.5 mb-4">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold text-xl text-white">
                  Earn<span className="text-emerald-400">Easy</span>
                </span>
              </Link>
              <p className="text-sm text-slate-400 leading-relaxed max-w-xs">
                Kenya&apos;s leading referral earning platform. Turn your network into M-Pesa earnings.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4 text-sm">Platform</h4>
              <ul className="space-y-2.5">
                {['Dashboard', 'Referrals', 'Earnings', 'Surveys'].map((item) => (
                  <li key={item}><Link href="#" className="text-sm text-slate-400 hover:text-emerald-400 transition-colors">{item}</Link></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4 text-sm">Company</h4>
              <ul className="space-y-2.5">
                {['About Us', 'Contact', 'Privacy Policy', 'Terms of Service'].map((item) => (
                  <li key={item}><Link href="#" className="text-sm text-slate-400 hover:text-emerald-400 transition-colors">{item}</Link></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4 text-sm">Support</h4>
              <ul className="space-y-2.5">
                {['Help Center', 'FAQ', 'Report Issue', 'Feedback'].map((item) => (
                  <li key={item}><Link href="#" className="text-sm text-slate-400 hover:text-emerald-400 transition-colors">{item}</Link></li>
                ))}
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-slate-500">
              © {new Date().getFullYear()} EarnEasy. All rights reserved.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span className="px-2 py-1 rounded bg-white/5 border border-white/10">Flutterwave</span>
              <span className="px-2 py-1 rounded bg-white/5 border border-white/10">M-Pesa</span>
              <span className="px-2 py-1 rounded bg-white/5 border border-white/10">MongoDB</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
