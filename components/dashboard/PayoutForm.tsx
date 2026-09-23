"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function PayoutForm({
  availableBalance,
}: {
  availableBalance: number;
}) {
  const router = useRouter();
  const [amount, setAmount] = useState("");
  const [type, setType] = useState<"bank" | "mobile_money">("mobile_money");
  const [accountNumber, setAccountNumber] = useState("");
  const [bankCode, setBankCode] = useState("");
  const [network, setNetwork] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/payouts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: Number(amount),
          destination: {
            type,
            accountNumber,
            bankCode: type === "bank" ? bankCode : undefined,
            network: type === "mobile_money" ? network : undefined,
          },
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Request failed");
      setAmount("");
      setAccountNumber("");
      router.refresh();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-2xl border p-6 space-y-4"
    >
      <h2 className="font-semibold text-lg">Request a payout</h2>
      <p className="text-sm text-slate-500">
        Available: <span className="font-semibold">KES {availableBalance}</span>
      </p>

      {error && (
        <div className="p-3 rounded-lg bg-red-50 text-red-700 text-sm">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium mb-1">Amount (KES)</label>
        <input
          type="number"
          min={1}
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
          className="w-full px-3 py-2 border rounded-lg"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Destination type</label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value as "bank" | "mobile_money")}
          className="w-full px-3 py-2 border rounded-lg"
        >
          <option value="mobile_money">Mobile Money</option>
          <option value="bank">Bank Transfer</option>
        </select>
      </div>

      {type === "mobile_money" ? (
        <>
          <div>
            <label className="block text-sm font-medium mb-1">Network</label>
            <input
              value={network}
              onChange={(e) => setNetwork(e.target.value)}
              placeholder="e.g. M-PESA"
              required
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Phone number</label>
            <input
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
        </>
      ) : (
        <>
          <div>
            <label className="block text-sm font-medium mb-1">Bank code</label>
            <input
              value={bankCode}
              onChange={(e) => setBankCode(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Account number</label>
            <input
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
        </>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full py-2.5 rounded-lg bg-emerald-600 text-white font-semibold hover:bg-emerald-700 disabled:opacity-50"
      >
        {loading ? "Submitting..." : "Request payout"}
      </button>
    </form>
  );
}