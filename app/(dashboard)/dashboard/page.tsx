import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifySessionToken, SESSION_COOKIE } from "@/lib/auth/session";
import { connectDB } from "@/lib/db/connect";
import { Wallet } from "@/lib/db/models/Wallet";
import { User } from "@/lib/db/models/User";
import { CommissionLedger } from "@/lib/db/models/CommissionLedger";

async function getDashboardData(userId: string) {
  await connectDB();
  const [wallet, user, referrals] = await Promise.all([
    Wallet.findOne({ userId }).lean(),
    User.findById(userId).select("name email referralCode hasPaid").lean(),
    CommissionLedger.aggregate([
      { $match: { userId: { $toObjectId: userId } } },
      { $group: { _id: "$level", total: { $sum: "$amount" }, count: { $sum: 1 } } },
    ]),
  ]);
  return { wallet, user, referrals };
}

export default async function DashboardPage() {
  const token = cookies().get(SESSION_COOKIE)?.value;
  const session = token ? await verifySessionToken(token) : null;
  if (!session) redirect("/login");

  const { wallet, user, referrals } = await getDashboardData(session.userId);
  const byLevel = (lvl: number) =>
    referrals.find((r) => r._id === lvl) ?? { total: 0, count: 0 };

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold">Hi, {user?.name?.split(" ")[0]} 👋</h1>
        <p className="text-slate-500 mt-1">
          Your referral code:{" "}
          <span className="font-mono font-semibold text-emerald-700">
            {user?.referralCode}
          </span>
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Stat label="Wallet Balance" value={`KES ${wallet?.balance ?? 0}`} accent />
        <Stat label="Total Earned" value={`KES ${wallet?.totalEarned ?? 0}`} />
        <Stat label="Withdrawn" value={`KES ${wallet?.totalWithdrawn ?? 0}`} />
        <Stat
          label="Total Referrals"
          value={String(byLevel(1).count + byLevel(2).count + byLevel(3).count)}
        />
      </div>

      <section className="bg-white rounded-2xl border p-6">
        <h2 className="font-semibold text-lg mb-4">Earnings by level</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <LevelCard level={1} amount={250} data={byLevel(1)} />
          <LevelCard level={2} amount={100} data={byLevel(2)} />
          <LevelCard level={3} amount={50} data={byLevel(3)} />
        </div>
      </section>
    </div>
  );
}

function Stat({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border p-5 bg-white ${
        accent ? "ring-2 ring-emerald-500" : ""
      }`}
    >
      <p className="text-sm text-slate-500">{label}</p>
      <p className="text-2xl font-bold mt-1">{value}</p>
    </div>
  );
}

function LevelCard({
  level,
  amount,
  data,
}: {
  level: number;
  amount: number;
  data: { total: number; count: number };
}) {
  return (
    <div className="rounded-xl border p-4 bg-slate-50">
      <p className="text-sm text-slate-500">
        Level {level} · KES {amount} each
      </p>
      <p className="text-2xl font-bold mt-1">KES {data.total}</p>
      <p className="text-xs text-slate-500 mt-1">{data.count} referrals</p>
    </div>
  );
}