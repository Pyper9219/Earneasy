import { connectDB } from "@/lib/db/connect";
import { Payout } from "@/lib/db/models/Payout";
import { User } from "@/lib/db/models/User";
import PayoutQueue from "@/components/admin/PayoutQueue";

export default async function AdminPayoutsPage() {
  await connectDB();
  const payouts = await Payout.find({})
    .sort({ createdAt: -1 })
    .limit(100)
    .populate({ path: "userId", model: User, select: "name email" })
    .lean();

  const serialized = payouts.map((p) => ({
    _id: String(p._id),
    amount: p.amount,
    status: p.status,
    createdAt: new Date(p.createdAt).toISOString(),
    destination: p.destination,
    user: p.userId as unknown as { name: string; email: string },
  }));

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold">Payout Queue</h1>
        <p className="text-slate-500 mt-1">Approve or reject withdrawal requests.</p>
      </header>
      <PayoutQueue payouts={serialized} />
    </div>
  );
}