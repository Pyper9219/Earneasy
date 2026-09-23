"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface PayoutItem {
  _id: string;
  amount: number;
  status: string;
  createdAt: string;
  destination: {
    type: string;
    accountNumber: string;
    bankCode?: string;
    network?: string;
  };
  user: { name: string; email: string };
}

export default function PayoutQueue({ payouts }: { payouts: PayoutItem[] }) {
  const router = useRouter();
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function act(id: string, action: "approve" | "reject") {
    setBusyId(id);
    setError(null);
    try {
      const res = await fetch(`/api/payouts/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Action failed");
      router.refresh();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="p-3 rounded-lg bg-red-50 text-red-700 text-sm">
          {error}
        </div>
      )}

      <div className="bg-white rounded-2xl border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-600">
            <tr>
              <th className="text-left px-4 py-3">User</th>
              <th className="text-right px-4 py-3">Amount</th>
              <th className="text-left px-4 py-3">Destination</th>
              <th className="text-left px-4 py-3">Status</th>
              <th className="text-right px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {payouts.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-slate-500">
                  No payout requests.
                </td>
              </tr>
            )}
            {payouts.map((p) => (
              <tr key={p._id}>
                <td className="px-4 py-3">
                  <p className="font-medium">{p.user?.name}</p>
                  <p className="text-xs text-slate-500">{p.user?.email}</p>
                </td>
                <td className="px-4 py-3 text-right font-medium">
                  KES {p.amount}
                </td>
                <td className="px-4 py-3 text-xs">
                  {p.destination.type === "mobile_money"
                    ? `${p.destination.network ?? "Mobile"} · ${p.destination.accountNumber}`
                    : `Bank ${p.destination.bankCode} · ${p.destination.accountNumber}`}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      p.status === "pending"
                        ? "bg-amber-100 text-amber-700"
                        : p.status === "completed"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-red-100 text-red-700"
                    }`}
                  >
                    {p.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-right space-x-2">
                  {p.status === "pending" ? (
                    <>
                      <button
                        onClick={() => act(p._id, "approve")}
                        disabled={busyId === p._id}
                        className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs hover:bg-emerald-700 disabled:opacity-50"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => act(p._id, "reject")}
                        disabled={busyId === p._id}
                        className="px-3 py-1.5 rounded-lg border text-xs hover:bg-slate-50 disabled:opacity-50"
                      >
                        Reject
                      </button>
                    </>
                  ) : (
                    <span className="text-xs text-slate-400">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}