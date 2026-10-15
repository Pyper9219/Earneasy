"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function VerifyPaymentPage() {
  const router = useRouter();
  const params = useSearchParams();
  const txRef = params.get("tx_ref");
  const transactionId = params.get("transaction_id");
  const [status, setStatus] = useState<"verifying" | "success" | "failed">(
    "verifying"
  );
  const [message, setMessage] = useState("Confirming your payment...");

  useEffect(() => {
    if (!txRef && !transactionId) {
      setStatus("failed");
      setMessage("Missing transaction reference.");
      return;
    }

    async function verify() {
      try {
        const query = new URLSearchParams();
        if (txRef) query.set("tx_ref", txRef);
        if (transactionId) query.set("transaction_id", transactionId);

        const res = await fetch(
          `/api/payments/flutterwave/verify?${query.toString()}`
        );
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Verification failed");

        setStatus("success");
        setMessage("Payment confirmed! Redirecting to your dashboard...");
        setTimeout(() => router.push("/dashboard"), 1500);
      } catch (err) {
        setStatus("failed");
        setMessage((err as Error).message);
      }
    }

    verify();
  }, [txRef, transactionId, router]);

  return (
    <div className="max-w-md mx-auto text-center py-20">
      {status === "verifying" && (
        <div className="animate-pulse text-slate-500 text-sm">{message}</div>
      )}
      {status === "success" && (
        <div className="p-6 rounded-2xl bg-emerald-50 text-emerald-700">
          <p className="text-lg font-semibold">✓ {message}</p>
        </div>
      )}
      {status === "failed" && (
        <div className="p-6 rounded-2xl bg-red-50 text-red-700">
          <p className="text-lg font-semibold">Payment verification failed</p>
          <p className="text-sm mt-2">{message}</p>
        </div>
      )}
    </div>
  );
}