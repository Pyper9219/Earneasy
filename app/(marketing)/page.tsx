import Link from "next/link";
import {
  Clock,
  ShieldCheck,
  Smartphone,
  Sparkles,
  TrendingUp,
  Users,
} from "lucide-react";

const earningLevels = [
  { title: "Level 1", amount: "KES 250", description: "Per direct referral" },
  { title: "Level 2", amount: "KES 100", description: "Per second-level referral" },
  { title: "Level 3", amount: "KES 50", description: "Per third-level referral" },
  { title: "Daily Surveys", amount: "KES 30–150", description: "Reward varies by survey" },
];

export default function MarketingPage() {
  return (
    <main className="min-h-screen bg-[#0B1326] text-white">
      <div className="overflow-hidden border-b border-emerald-500/20 bg-emerald-500/10 py-2">
        <div className="flex animate-pulse justify-center whitespace-nowrap">
          <span className="mx-4 text-sm text-emerald-400">
            Welcome to EarnEasy — explore referrals and available surveys
          </span>
        </div>
      </div>

      <section className="relative mx-auto max-w-5xl px-4 py-20 text-center">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-sm font-medium text-emerald-400">
          <Sparkles className="h-4 w-4" />
          EarnEasy referral and survey platform
        </div>
        <h1 className="mb-6 text-4xl font-extrabold tracking-tight md:text-6xl">
          Turn Your Network &amp; Time into{" "}
          <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
            M-Pesa Earnings
          </span>
        </h1>
        <p className="mx-auto mb-8 max-w-2xl text-lg text-slate-400">
          Activate your account for a one-time fee of{" "}
          <span className="font-bold text-white">KES 450</span> to access
          referral commissions and available surveys.
        </p>
        <div className="flex flex-col justify-center gap-4 sm:flex-row">
          <Link
            href="/register"
            className="rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 px-8 py-4 text-lg font-bold text-white shadow-lg shadow-emerald-500/25 transition-all hover:brightness-110"
          >
            Get Started
          </Link>
          <Link
            href="/#levels"
            className="rounded-xl border border-white/10 bg-white/5 px-8 py-4 text-lg font-semibold text-white transition-all hover:bg-white/10"
          >
            Explore Earnings
          </Link>
        </div>
      </section>

      <section id="levels" className="mx-auto max-w-6xl px-4 py-20">
        <h2 className="mb-12 text-center text-3xl font-bold">
          Earning Opportunities
        </h2>
        <div className="grid gap-6 md:grid-cols-4">
          {earningLevels.map((item, index) => (
            <div
              key={item.title}
              className="group rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-all hover:border-emerald-500/50"
            >
              {index === 3 ? (
                <Clock className="mb-4 h-8 w-8 text-emerald-400 transition-transform group-hover:scale-110" />
              ) : (
                <Users className="mb-4 h-8 w-8 text-emerald-400 transition-transform group-hover:scale-110" />
              )}
              <h3 className="mb-2 text-xl font-bold">{item.title}</h3>
              <p className="mb-2 text-2xl font-extrabold text-emerald-400">
                {item.amount}
              </p>
              <p className="text-sm text-slate-400">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-white/10 bg-white/5 px-4 py-20">
        <div className="mx-auto grid max-w-6xl gap-8 text-center md:grid-cols-3">
          <div className="p-6">
            <Smartphone className="mx-auto mb-4 h-10 w-10 text-emerald-400" />
            <h3 className="mb-2 text-xl font-bold">Convenient Payouts</h3>
            <p className="text-slate-400">
              Request withdrawals to your supported payout destination.
            </p>
          </div>
          <div className="p-6">
            <ShieldCheck className="mx-auto mb-4 h-10 w-10 text-emerald-400" />
            <h3 className="mb-2 text-xl font-bold">Flutterwave Payments</h3>
            <p className="text-slate-400">
              Activation payments are processed through Flutterwave.
            </p>
          </div>
          <div className="p-6">
            <TrendingUp className="mx-auto mb-4 h-10 w-10 text-emerald-400" />
            <h3 className="mb-2 text-xl font-bold">Track Your Progress</h3>
            <p className="text-slate-400">
              Follow your referrals and earnings from your dashboard.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
