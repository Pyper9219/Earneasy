import Link from "next/link";

export default function MarketingPage() {
  return (
    <section className="max-w-4xl mx-auto px-4 py-20 text-center">
      <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
        Earn <span className="text-emerald-600">KES 250</span> for every friend
        who joins.
      </h1>
      <p className="mt-6 text-lg text-slate-600">
        A 3-level referral program. Invite friends, they invite theirs, and you
        earn up to KES 400 per paying member in your network.
      </p>
      <div className="mt-10 flex items-center justify-center gap-4">
        <Link
          href="/register"
          className="px-8 py-3 rounded-lg bg-emerald-600 text-white font-semibold hover:bg-emerald-700"
        >
          Start Earning
        </Link>
        <Link
          href="/login"
          className="px-8 py-3 rounded-lg border border-slate-300 font-semibold hover:bg-slate-50"
        >
          I already have an account
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20 text-left">
        <Feature title="Level 1 — KES 250" desc="Direct referrals who pay." />
        <Feature title="Level 2 — KES 100" desc="Your referrals' referrals." />
        <Feature title="Level 3 — KES 50" desc="Third generation in your tree." />
      </div>
    </section>
  );
}

function Feature({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="p-6 rounded-xl border bg-slate-50">
      <h3 className="font-bold text-lg">{title}</h3>
      <p className="text-slate-600 mt-2 text-sm">{desc}</p>
    </div>
  );
}