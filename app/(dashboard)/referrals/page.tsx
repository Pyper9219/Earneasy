import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Types } from "mongoose";
import { verifySessionToken, SESSION_COOKIE } from "@/lib/auth/session";
import { connectDB } from "@/lib/db/connect";
import { User, IUser } from "@/lib/db/models/User";
import { CommissionLedger } from "@/lib/db/models/CommissionLedger";

type ReferralListUser = Pick<IUser, "_id" | "name" | "email" | "referralCode" | "createdAt">;

async function getTree(userId: string) {
  await connectDB();
  const rootId = new Types.ObjectId(userId);

  const l1 = await User.find({ referredBy: rootId })
    .select("name email referralCode createdAt")
    .lean<ReferralListUser[]>();
  const l1Ids = l1.map((u) => u._id);

  const l2 = await User.find({ referredBy: { $in: l1Ids } })
    .select("name email referralCode referredBy createdAt")
    .lean<ReferralListUser[]>();
  const l2Ids = l2.map((u) => u._id);

  const l3 = await User.find({ referredBy: { $in: l2Ids } })
    .select("name email referralCode referredBy createdAt")
    .lean<ReferralListUser[]>();

  return { l1, l2, l3 };
}

async function getEarnings(userId: string) {
  const rows = await CommissionLedger.aggregate<{ _id: number; total: number }>([
    { $match: { userId: new Types.ObjectId(userId) } },
    { $group: { _id: "$level", total: { $sum: "$amount" } } },
  ]);

  const byLevel: Record<number, number> = { 1: 0, 2: 0, 3: 0 };
  let total = 0;
  for (const row of rows) {
    byLevel[row._id] = row.total;
    total += row.total;
  }
  return { total, byLevel };
}

export default async function ReferralsPage() {
  const token = cookies().get(SESSION_COOKIE)?.value;
  const session = token ? await verifySessionToken(token) : null;
  if (!session) redirect("/login");

  const { l1, l2, l3 } = await getTree(session.userId);
  const { total, byLevel } = await getEarnings(session.userId);
  const referralCount = l1.length + l2.length + l3.length;

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold">Your Referral Tree</h1>
        <p className="text-slate-500 mt-1">
          {l1.length} direct · {l2.length} level 2 · {l3.length} level 3
        </p>
      </header>

      {/* Total referral earnings */}
      <section className="relative overflow-hidden rounded-2xl border border-emerald-500/25 bg-gradient-to-br from-emerald-500/15 via-emerald-500/5 to-transparent p-6">
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-emerald-500/10 blur-2xl" />
        <div className="relative flex flex-wrap items-start justify-between gap-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-emerald-300">
              Total referral earnings
            </p>
            <p className="mt-2 text-4xl font-extrabold text-white">
              KES {total.toLocaleString()}
            </p>
            <p className="mt-1 text-sm text-slate-400">
              From {referralCount} referral{referralCount === 1 ? "" : "s"} across three levels
            </p>
            <Link
              href="/earnings"
              className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-emerald-300 hover:text-emerald-200"
            >
              View commission ledger →
            </Link>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center">
            {[1, 2, 3].map((level) => (
              <div
                key={level}
                className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3"
              >
                <p className="text-[11px] uppercase tracking-wide text-slate-400">
                  Level {level}
                </p>
                <p className="mt-1 text-lg font-bold text-white">
                  {level === 1 ? "250" : level === 2 ? "100" : "50"}
                </p>
                <p className="text-[11px] text-emerald-300">
                  KES {byLevel[level].toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Section title={`Level 1 — Direct (${l1.length})`} users={l1} />
      <Section title={`Level 2 (${l2.length})`} users={l2} />
      <Section title={`Level 3 (${l3.length})`} users={l3} />
    </div>
  );
}

function Section({
  title,
  users,
}: {
  title: string;
  users: ReferralListUser[];
}) {
  return (
    <section className="bg-white rounded-2xl border p-6">
      <h2 className="font-semibold text-lg mb-4">{title}</h2>
      {users.length === 0 ? (
        <p className="text-sm text-slate-500">No referrals yet.</p>
      ) : (
        <ul className="divide-y">
          {users.map((u) => (
            <li key={String(u._id)} className="py-3 flex items-center justify-between">
              <div>
                <p className="font-medium">{u.name}</p>
                <p className="text-sm text-slate-500">{u.email}</p>
              </div>
              <span className="font-mono text-xs bg-slate-100 px-2 py-1 rounded">
                {u.referralCode}
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
