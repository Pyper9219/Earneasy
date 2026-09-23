import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifySessionToken, SESSION_COOKIE } from "@/lib/auth/session";
import { connectDB } from "@/lib/db/connect";
import { CommissionLedger } from "@/lib/db/models/CommissionLedger";
import { Types } from "mongoose";

export default async function EarningsPage() {
  const token = cookies().get(SESSION_COOKIE)?.value;
  const session = token ? await verifySessionToken(token) : null;
  if (!session) redirect("/login");

  await connectDB();
  const entries = await CommissionLedger.find({
    userId: new Types.ObjectId(session.userId),
  })
    .sort({ createdAt: -1 })
    .limit(100)
    .lean();

  const totals = entries.reduce(
    (acc, e) => {
      acc[e.level] = (acc[e.level] ?? 0) + e.amount;
      return acc;
    },
    {} as Record<number, number>
  );

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold">Earnings</h1>
        <p className="text-slate-500 mt-1">Your commission ledger.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((lvl) => (
          <div key={lvl} className="bg-white rounded-2xl border p-5">
            <p className="text-sm text-slate-500">Level {lvl}</p>
            <p className="text-2xl font-bold mt-1">KES {totals[lvl] ?? 0}</p>
          </div>
        ))}
      </div>

      <section className="bg-white rounded-2xl border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-600">
            <tr>
              <th className="text-left px-4 py-3">Date</th>
              <th className="text-left px-4 py-3">Level</th>
              <th className="text-right px-4 py-3">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {entries.length === 0 && (
              <tr>
                <td colSpan={3} className="px-4 py-8 text-center text-slate-500">
                  No earnings yet.
                </td>
              </tr>
            )}
            {entries.map((e) => (
              <tr key={String(e._id)}>
                <td className="px-4 py-3">
                  {new Date(e.createdAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-3">Level {e.level}</td>
                <td className="px-4 py-3 text-right font-medium">
                  + KES {e.amount}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}