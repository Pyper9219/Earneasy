import { connectDB } from "@/lib/db/connect";
import { User } from "@/lib/db/models/User";
import { Payment } from "@/lib/db/models/Payment";
import { CommissionLedger } from "@/lib/db/models/CommissionLedger";
import { Payout } from "@/lib/db/models/Payout";

export default async function AdminOverviewPage() {
  await connectDB();
  const [users, paidUsers, payments, commissions, pendingPayouts] =
    await Promise.all([
      User.countDocuments(),
      User.countDocuments({ hasPaid: true }),
      Payment.aggregate([
        { $match: { status: "successful" } },
        { $group: { _id: null, total: { $sum: "$amount" }, count: { $sum: 1 } } },
      ]),
      CommissionLedger.aggregate([
        { $group: { _id: null, total: { $sum: "$amount" }, count: { $sum: 1 } } },
      ]),
      Payout.countDocuments({ status: "pending" }),
    ]);

  const revenue = payments[0]?.total ?? 0;
  const commissionTotal = commissions[0]?.total ?? 0;

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold">Admin Overview</h1>
        <p className="text-slate-500 mt-1">Platform-wide metrics.</p>
      </header>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Stat label="Total Users" value={String(users)} />
        <Stat label="Paying Users" value={String(paidUsers)} />
        <Stat label="Successful Payments" value={String(payments[0]?.count ?? 0)} />
        <Stat label="Revenue (KES)" value={String(revenue)} accent />
        <Stat label="Commissions Paid (KES)" value={String(commissionTotal)} />
        <Stat label="Pending Payouts" value={String(pendingPayouts)} />
      </div>
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
      <p className="text-xs text-slate-500">{label}</p>
      <p className="text-xl font-bold mt-1">{value}</p>
    </div>
  );
}