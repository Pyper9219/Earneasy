"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MIN_PAYOUT_KES } from "@/lib/utils/constants";

interface PayoutFormProps {
  availableBalance: number;
}

type MethodId = "mpesa" | "paypal" | "flutterwave" | "eversend";

const METHODS: Array<{
  id: MethodId;
  label: string;
  inputLabel: string;
  placeholder: string;
  hint: string;
  inputType: "tel" | "email" | "text";
}> = [
  {
    id: "mpesa",
    label: "M-Pesa",
    inputLabel: "M-Pesa phone number",
    placeholder: "0712345678",
    hint: "Safaricom number that will receive the money.",
    inputType: "tel",
  },
  {
    id: "paypal",
    label: "PayPal",
    inputLabel: "PayPal email",
    placeholder: "you@example.com",
    hint: "The email on your PayPal account.",
    inputType: "email",
  },
  {
    id: "flutterwave",
    label: "Flutterwave",
    inputLabel: "Flutterwave account (email or ID)",
    placeholder: "you@example.com",
    hint: "The account or email registered on Flutterwave.",
    inputType: "text",
  },
  {
    id: "eversend",
    label: "Eversend",
    inputLabel: "Eversend email or phone",
    placeholder: "you@example.com",
    hint: "The email or phone on your Eversend wallet.",
    inputType: "text",
  },
];

export default function PayoutForm({ availableBalance }: PayoutFormProps) {
  const router = useRouter();
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState<MethodId>("mpesa");
  const [accountNumber, setAccountNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const active = METHODS.find((m) => m.id === method)!;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    const numAmount = Number(amount);
    if (!numAmount || numAmount <= 0) {
      setError("Enter the amount you want to withdraw");
      setLoading(false);
      return;
    }
    if (numAmount > availableBalance) {
      setError(`Insufficient balance. You have KES ${availableBalance}.`);
      setLoading(false);
      return;
    }
    if (!accountNumber.trim()) {
      setError(`Enter your ${active.inputLabel.toLowerCase()}`);
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/payouts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: numAmount,
          destination: {
            type: method,
            accountNumber: accountNumber.trim(),
            ...(method === "mpesa" ? { network: "M-PESA" } : {}),
          },
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to request payout");
        return;
      }

      setSuccess(
        `Withdrawal request sent. It is now waiting for admin approval.`
      );
      setAmount("");
      setAccountNumber("");
      router.refresh();
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-white rounded-2xl border p-6">
      <h2 className="font-semibold text-lg mb-1">Request Withdrawal</h2>
      <p className="text-sm text-slate-500 mb-4">
        Choose where you want to receive the money.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-300 text-sm">
            {error}
          </div>
        )}
        {success && (
          <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-sm">
            {success}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium mb-2">Withdrawal method</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {METHODS.map((m) => {
              const selected = m.id === method;
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => {
                    setMethod(m.id);
                    setAccountNumber("");
                    setError("");
                  }}
                  aria-pressed={selected}
                  className={`px-3 py-2.5 rounded-xl text-sm font-medium border transition ${
                    selected
                      ? "border-emerald-500/60 bg-emerald-500/15 text-emerald-300"
                      : "border-white/10 bg-white/[0.03] text-slate-300 hover:bg-white/[0.07]"
                  }`}
                >
                  {m.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Amount (KES)</label>
            <input
              type="number"
              inputMode="decimal"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full rounded-lg border px-3 py-2"
              placeholder="0"
              required
            />
            <p className="text-xs text-slate-500 mt-1">
              Available: KES {availableBalance}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              {active.inputLabel}
            </label>
            <input
              type={active.inputType}
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              className="w-full rounded-lg border px-3 py-2"
              placeholder={active.placeholder}
              required
            />
            <p className="text-xs text-slate-500 mt-1">{active.hint}</p>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-emerald-600 text-white py-3 rounded-lg font-semibold hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Sending request..." : "Request Withdrawal"}
        </button>

        <p className="text-xs text-slate-500 text-center">
          Withdrawals are reviewed by an admin before payment. You will get an
          email at every step.
        </p>
      </form>
    </section>
  );
}
