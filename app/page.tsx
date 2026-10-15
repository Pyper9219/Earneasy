import Link from 'next/link';
import { Sparkles, TrendingUp, Users, Clock, ShieldCheck, Smartphone } from 'lucide-react';

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-[#0B1326] text-white">
      {/* Live Payouts Marquee Ticker */}
      <div className="bg-emerald-500/10 border-b border-emerald-500/20 py-2 overflow-hidden">
        <div className="flex whitespace-nowrap animate-pulse">
          <span className="mx-4 text-sm text-emerald-400">🔥 John K. just withdrew KES 2,500 via M-Pesa</span>
          <span className="mx-4 text-sm text-emerald-400">💰 Mary W. earned KES 150 from a 3-min survey</span>
          <span className="mx-4 text-sm text-emerald-400">🚀 David O. activated his account and unlocked Level 1 referrals</span>
          <span className="mx-4 text-sm text-emerald-400">🔥 John K. just withdrew KES 2,500 via M-Pesa</span>
        </div>
      </div>

      {/* Hero & Value Proposition */}
      <section className="relative px-4 py-20 text-center max-w-5xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm font-medium mb-6">
          <Sparkles className="w-4 h-4" /> Kenya's #1 Micro-Earning Platform
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
          Turn Your Network & Time into <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">Real M-Pesa Cash</span>
        </h1>
        <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-8">
          Activate your account for a one-time fee of <span className="text-white font-bold">KES 450</span> and unlock dual earning paths: 
          High-paying referral commissions and instant daily paid surveys.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/register" className="px-8 py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-bold text-lg shadow-lg shadow-emerald-500/25 hover:brightness-110 transition-all">
            Get Started Now
          </Link>
          <Link href="/#calculator" className="px-8 py-4 rounded-xl bg-white/5 border border-white/10 text-white font-semibold text-lg hover:bg-white/10 transition-all">
            Calculate Earnings
          </Link>
        </div>
      </section>

      {/* Cascading Matrix Breakdown */}
      <section id="levels" className="py-20 px-4 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">Transparent Earning Matrix</h2>
        <div className="grid md:grid-cols-4 gap-6">
          {[
            { level: 'Level 1', amount: 'KES 250', desc: 'Per direct referral', icon: Users },
            { level: 'Level 2', amount: 'KES 100', desc: 'Per indirect referral', icon: Users },
            { level: 'Level 3', amount: 'KES 50', desc: 'Per extended network', icon: Users },
            { level: 'Daily Surveys', amount: 'KES 30-150', desc: 'Per completed survey', icon: Clock },
          ].map((item, idx) => (
            <div key={idx} className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm hover:border-emerald-500/50 transition-all group">
              <item.icon className="w-8 h-8 text-emerald-400 mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-bold mb-2">{item.level}</h3>
              <p className="text-2xl font-extrabold text-emerald-400 mb-2">{item.amount}</p>
              <p className="text-sm text-slate-400">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Local Trust & Infrastructure Grid */}
      <section className="py-20 px-4 bg-white/5 border-y border-white/10">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8 text-center">
          <div className="p-6">
            <Smartphone className="w-10 h-10 text-emerald-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Instant M-Pesa STK</h3>
            <p className="text-slate-400">Withdraw your earnings directly to your M-Pesa number in seconds.</p>
          </div>
          <div className="p-6">
            <ShieldCheck className="w-10 h-10 text-emerald-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Flutterwave Secured</h3>
            <p className="text-slate-400">Bank-grade encryption for all activation payments and data.</p>
          </div>
          <div className="p-6">
            <TrendingUp className="w-10 h-10 text-emerald-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">24/7 WhatsApp Concierge</h3>
            <p className="text-slate-400">Real-time downline tracking and dedicated support anytime.</p>
          </div>
        </div>
      </section>
    </main>
  );
}