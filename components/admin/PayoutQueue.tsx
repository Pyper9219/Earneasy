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

const METHOD_LABELS: Record<string, string> = {
  mpesa: "M-Pesa",
  paypal: "PayPal",
  flutterwave: "Flutterwave",
  eversend: "Eversend",
  mobile_money: "Mobile money",
  bank: "Bank transfer",
};

function destinationLabel(d: PayoutItem["destination"]): string {
  const method = METHOD_LABELS[d.type] ?? d.type;
  const detail =
    d.type === "bank"
      ? `${d.bankCode ?? ""} ${d.accountNumber}`.trim()
      : d.type === "mobile_money"
        ? `${d.network ?? ""} ${d.accountNumber}`.trim()
        : d.accountNumber;
  return `${method} · ${detail}`;
}

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-amber-500/15 text-amber-300 border border-amber-500/30",
  approved: "bg-sky-500/15 text-sky-300 border border-sky-500/30",
  processing: "bg-indigo-500/15 text-indigo-300 border border-indigo-500/30",
  completed: "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30",
  rejected: "bg-rose-500/15 text-rose-300 border border-rose-500/30",
  failed: "bg-rose-500/15 text-rose-300 border border-rose-500/30",
};

export default function PayoutQueue({ payouts }: { payouts: PayoutItem[] }) {
  const router = useRouter();
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const pendingCount = payouts.filter((p) => p.status === "pending").length;

  async function act(
    id: string,
    action: "approve" | "reject" | "mark_paid"
  ) {
    let reason: string | undefined;
    if (action === "reject") {
      const input = window.prompt("Reason for rejecting this withdrawal?");
      if (input === null) return;
      reason = input || "Rejected by admin";
    }
    if (action === "approve") {
      const ok = window.confirm(
        "Approve this withdrawal? The user has been notified and the funds will be released."
      );
      if (!ok) return;
    }

    setBusyId(id);
    setError(null);
    try {
      const res = await fetch(`/api/payouts/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, reason }),
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
      <div className="flex flex-wrap items-center gap-3 text-sm">
        <span className="px-3 py-1.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30">
          {pendingCount} awaiting approval
        </span>
        <span className="text-slate-500">
          {payouts.length} request{payouts.length === 1 ? "" : "s"} total
        </span>
      </div>

      {error && (
        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-300 text-sm">
          {error}
        </div>
      )}

      <div className="bg-white rounded-2xl border overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-600">
            <tr>
              <th className="text-left px-4 py-3">User</th>
              <th className="text-right px-4 py-3">Amount</th>
              <th className="text-left px-4 py-3">Destination</th>
              <th className="text-left px-4 py-3">Requested</th>
              <th className="text-left px-4 py-3">Status</th>
              <th className="text-right px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {payouts.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-slate-500">
                  No withdrawal requests yet.
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
                  {destinationLabel(p.destination)}
                </td>
                <td className="px-4 py-3 text-xs text-slate-500">
                  {new Date(p.createdAt).toLocaleString()}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      STATUS_STYLES[p.status] ?? "bg-slate-500/15 text-slate-300"
                    }`}
                  >
                    {p.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-right whitespace-nowrap space-x-2">
                  {p.status === "pending" && (
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
                  )}
                  {(p.status === "approved" || p.status === "processing") && (
                    <>
                      <button
                        onClick={() => act(p._id, "mark_paid")}
                        disabled={busyId === p._id}
                        className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs hover:bg-emerald-700 disabled:opacity-50"
                      >
                        Mark paid
                      </button>
                      <button
                        onClick={() => act(p._id, "reject")}
                        disabled={busyId === p._id}
                        className="px-3 py-1.5 rounded-lg border text-xs hover:bg-slate-50 disabled:opacity-50"
                      >
                        Reject
                      </button>
                    </>
                  )}
                  {!["pending", "approved", "processing"].includes(p.status) && (
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
