import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifySessionToken, SESSION_COOKIE } from "@/lib/auth/session";
import { connectDB } from "@/lib/db/connect";
import { Wallet } from "@/lib/db/models/Wallet";
import { Payout } from "@/lib/db/models/Payout";
import PayoutForm from "@/components/dashboard/PayoutForm";

export default async function PayoutsPage() {
  const token = cookies().get(SESSION_COOKIE)?.value;
  const session = token ? await verifySessionToken(token) : null;
  if (!session) redirect("/login");

  await connectDB();
  const [wallet, payouts] = await Promise.all([
    Wallet.findOne({ userId: session.userId }).lean(),
    Payout.find({ userId: session.userId }).sort({ createdAt: -1 }).limit(20).lean(),
  ]);

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold">Payouts</h1>
        <p className="text-slate-500 mt-1">
          Available balance:{" "}
          <span className="font-semibold text-emerald-700">
            KES {wallet?.balance ?? 0}
          </span>
        </p>
      </header>

      <PayoutForm availableBalance={wallet?.balance ?? 0} />

      <section className="bg-white rounded-2xl border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-600">
            <tr>
              <th className="text-left px-4 py-3">Date</th>
              <th className="text-right px-4 py-3">Amount</th>
              <th className="text-left px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {payouts.length === 0 && (
              <tr>
                <td colSpan={3} className="px-4 py-8 text-center text-slate-500">
                  No payout requests yet.
                </td>
              </tr>
            )}
            {payouts.map((p) => (
              <tr key={String(p._id)}>
                <td className="px-4 py-3">
                  {new Date(p.createdAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-3 text-right">KES {p.amount}</td>
                <td className="px-4 py-3 capitalize">{p.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}