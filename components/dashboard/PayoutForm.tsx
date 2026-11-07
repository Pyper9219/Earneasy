"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface PayoutFormProps {
  availableBalance: number;
}

export default function PayoutForm({ availableBalance }: PayoutFormProps) {
  const router = useRouter();
  const [amount, setAmount] = useState("");
  const [type, setType] = useState<"bank" | "mobile_money">("mobile_money");
  const [accountNumber, setAccountNumber] = useState("");
  const [bankCode, setBankCode] = useState("");
  const [network, setNetwork] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const numAmount = Number(amount);
    if (!numAmount || numAmount < 1) {
      setError("Enter a valid amount");
      setLoading(false);
      return;
    }
    if (numAmount > availableBalance) {
      setError("Insufficient balance");
      setLoading(false);
      return;
    }
    if (!accountNumber) {
      setError("Enter account/phone number");
      setLoading(false);
      return;
    }
    if (type === "bank" && !bankCode) {
      setError("Enter bank code");
      setLoading(false);
      return;
    }
    if (type === "mobile_money" && !network) {
      setError("Enter network (e.g., MPESA, AIRTEL)");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/payouts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: numAmount,
          type,
          accountNumber,
          bankCode: type === "bank" ? bankCode : undefined,
          network: type === "mobile_money" ? network : undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to request payout");
        return;
      }

      router.refresh();
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-white rounded-2xl border p-6">
      <h2 className="font-semibold text-lg mb-4">Request Payout</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 rounded-lg bg-red-50 text-red-700 text-sm">{error}</div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Amount (KES)</label>
            <input
              type="number"
              min="1"
              max={availableBalance}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="0"
              required
            />
            <p className="text-xs text-slate-500 mt-1">Available: KES {availableBalance}</p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Payout Method</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  value="mobile_money"
                  checked={type === "mobile_money"}
                  onChange={() => setType("mobile_money")}
                  className="text-emerald-600"
                />
                Mobile Money
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  value="bank"
                  checked={type === "bank"}
                  onChange={() => setType("bank")}
                  className="text-emerald-600"
                />
                Bank Transfer
              </label>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            {type === "bank" ? "Account Number" : "Phone Number"}
          </label>
          <input
            type="text"
            value={accountNumber}
            onChange={(e) => setAccountNumber(e.target.value)}
            className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            placeholder={type === "bank" ? "Account number" : "Phone number (e.g., 2547xxxxxxxx)"}
            required
          />
        </div>

        {type === "bank" && (
          <div>
            <label className="block text-sm font-medium mb-1">Bank Code</label>
            <input
              type="text"
              value={bankCode}
              onChange={(e) => setBankCode(e.target.value)}
              className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="Bank code"
              required
            />
          </div>
        )}

        {type === "mobile_money" && (
          <div>
            <label className="block text-sm font-medium mb-1">Network</label>
            <input
              type="text"
              value={network}
              onChange={(e) => setNetwork(e.target.value)}
              className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="MPESA, AIRTEL, etc."
              required
            />
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-emerald-600 text-white py-3 rounded-lg font-semibold hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Processing..." : "Request Payout"}
        </button>
      </form>
    </section>
  );
}
