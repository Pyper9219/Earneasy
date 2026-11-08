"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CLIENT_PRICE_KES } from "@/lib/utils/constants";

type Phase = "loading" | "ready" | "sending" | "pending" | "success" | "failed";

export default function ActivatePage() {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>("loading");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [txRef, setTxRef] = useState<string | null>(null);
  const [receipt, setReceipt] = useState<string | null>(null);
  const polling = useRef(false);

  // Load the signed-in user and pre-fill their phone number.
  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const res = await fetch("/api/me", { cache: "no-store" });
        if (res.status === 401) {
          router.replace("/login?next=/activate");
          return;
        }
        const data = await res.json();
        if (cancelled) return;

        if (data?.user?.hasPaid) {
          router.replace("/dashboard");
          return;
        }
        if (data?.user?.phone) {
          setPhone(String(data.user.phone).replace(/^254/, "0"));
        }
        setPhase("ready");
      } catch {
        if (!cancelled) {
          setPhase("ready");
          setMessage("Could not load your details. You can still pay below.");
        }
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [router]);

  const checkStatus = useCallback(
    async (ref: string) => {
      try {
        const res = await fetch(
          `/api/payments/palpluss/status?tx_ref=${encodeURIComponent(ref)}`,
          { cache: "no-store" }
        );
        const data = await res.json();

        if (!res.ok) {
          setMessage(data?.error || "Could not check the payment status.");
          return true;
        }

        if (data.status === "successful") {
          setPhase("success");
          setReceipt(data.receipt ?? null);
          setMessage("Payment confirmed. Your account is active.");
          setTimeout(() => router.push("/dashboard"), 1800);
          return true;
        }

        if (data.status === "failed") {
          setPhase("failed");
          setMessage(data.message || "The payment was not completed.");
          return true;
        }

        setMessage(data.message || "Waiting for you to enter your M-Pesa PIN.");
        return false;
      } catch {
        return false;
      }
    },
    [router]
  );

  // Poll while the STK prompt is on the phone.
  useEffect(() => {
    if (phase !== "pending" || !txRef || polling.current) return;
    polling.current = true;

    let attempts = 0;
    const timer = setInterval(async () => {
      attempts += 1;
      const done = await checkStatus(txRef);
      if (done || attempts >= 40) {
        clearInterval(timer);
        polling.current = false;
        if (!done) {
          setPhase("failed");
          setMessage(
            "We did not get a confirmation. If you paid, wait a minute and refresh this page."
          );
        }
      }
    }, 3000);

    return () => {
      clearInterval(timer);
      polling.current = false;
    };
  }, [phase, txRef, checkStatus]);

  async function startPayment(e: React.FormEvent) {
    e.preventDefault();
    setPhase("sending");
    setMessage("");

    try {
      const res = await fetch("/api/payments/palpluss/stk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });
      const data = await res.json();

      if (!res.ok) {
        setPhase("failed");
        setMessage(data?.error || "Could not start the payment.");
        return;
      }

      setTxRef(data.txRef);
      setPhase("pending");
      setMessage(data.customerMessage || "Check your phone for the M-Pesa prompt.");
      checkStatus(data.txRef);
    } catch {
      setPhase("failed");
      setMessage("Network error. Check your connection and try again.");
    }
  }

  return (
    <div className="min-h-screen bg-[#050b1a] text-white flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <Link href="/dashboard" className="text-sm text-slate-400 hover:text-emerald-400">
          ← Back
        </Link>

        <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-6 shadow-2xl">
          <div className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
            Account activation
          </div>
          <h1 className="mt-2 text-2xl font-bold">Unlock your account</h1>
          <p className="mt-2 text-sm text-slate-400">
            Pay a one-time activation fee of{" "}
            <span className="font-semibold text-white">KES {CLIENT_PRICE_KES}</span> with
            M-Pesa. Your account is switched on the moment the payment is confirmed.
          </p>

          {phase === "loading" && (
            <p className="mt-6 text-sm text-slate-400 animate-pulse">Loading…</p>
          )}

          {(phase === "ready" || phase === "sending" || phase === "failed") && (
            <form onSubmit={startPayment} className="mt-6 space-y-4">
              <div>
                <label htmlFor="phone" className="block text-sm font-medium mb-1.5">
                  M-Pesa number
                </label>
                <input
                  id="phone"
                  type="tel"
                  inputMode="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="0712345678"
                  required
                  className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white placeholder:text-slate-500 outline-none focus:border-emerald-500/60 focus:ring-2 focus:ring-emerald-500/20"
                />
                <p className="mt-1.5 text-xs text-slate-500">
                  Safaricom only. You will get a prompt on this phone.
                </p>
              </div>

              <button
                type="submit"
                disabled={phase === "sending"}
                className="w-full rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 px-4 py-3 font-semibold text-white shadow-lg shadow-emerald-500/25 transition hover:shadow-emerald-500/40 disabled:opacity-50"
              >
                {phase === "sending"
                  ? "Sending prompt…"
                  : `Pay KES ${CLIENT_PRICE_KES} with M-Pesa`}
              </button>
            </form>
          )}

          {phase === "pending" && (
            <div className="mt-6 space-y-3">
              <div className="flex items-center gap-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 px-4 py-3">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
                </span>
                <p className="text-sm text-emerald-300">{message}</p>
              </div>
              <p className="text-xs text-slate-500">
                Enter your M-Pesa PIN on the prompt. This page updates by itself.
              </p>
              <button
                type="button"
                onClick={() => txRef && checkStatus(txRef)}
                className="text-xs text-slate-400 underline hover:text-emerald-400"
              >
                I already paid, check again
              </button>
            </div>
          )}

          {phase === "failed" && message && (
            <div className="mt-4 rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-300">
              {message}
            </div>
          )}

          {phase === "success" && (
            <div className="mt-6 rounded-xl bg-emerald-500/10 border border-emerald-500/20 px-4 py-4">
              <p className="text-lg font-semibold text-emerald-300">✓ {message}</p>
              {receipt && (
                <p className="mt-1 text-xs text-emerald-200/80">Receipt: {receipt}</p>
              )}
              <p className="mt-2 text-sm text-slate-400">Taking you to your dashboard…</p>
            </div>
          )}

          {phase === "ready" && message && (
            <p className="mt-4 text-xs text-slate-500">{message}</p>
          )}
        </div>

        <p className="mt-6 text-center text-xs text-slate-500">
          Payment is processed by Safaricom M-Pesa. You will be charged KES{" "}
          {CLIENT_PRICE_KES} once.
        </p>
      </div>
    </div>
  );
}
