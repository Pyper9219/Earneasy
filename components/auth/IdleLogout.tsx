"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

/**
 * Signs the user out after two minutes without activity.
 * Shows a short warning first so nobody loses work by surprise.
 */
const IDLE_MS = 2 * 60 * 1000;
const WARNING_MS = 15 * 1000;

export default function IdleLogout() {
  const router = useRouter();
  const [warning, setWarning] = useState(false);
  const idleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const logoutTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function logout() {
      if (cancelled) return;
      try {
        await fetch("/api/auth/logout", { method: "POST" });
      } catch {
        // ignore network errors, redirect anyway
      }
      router.replace("/login?timeout=1");
      router.refresh();
    }

    function clearTimers() {
      if (idleTimer.current) clearTimeout(idleTimer.current);
      if (logoutTimer.current) clearTimeout(logoutTimer.current);
    }

    function schedule() {
      clearTimers();
      idleTimer.current = setTimeout(() => {
        setWarning(true);
        logoutTimer.current = setTimeout(logout, WARNING_MS);
      }, IDLE_MS - WARNING_MS);
    }

    function onActivity() {
      setWarning(false);
      schedule();
    }

    const events = ["mousemove", "keydown", "click", "scroll", "touchstart"] as const;
    events.forEach((event) =>
      window.addEventListener(event, onActivity, { passive: true })
    );
    window.addEventListener("visibilitychange", onActivity);

    schedule();

    return () => {
      cancelled = true;
      clearTimers();
      events.forEach((event) => window.removeEventListener(event, onActivity));
      window.removeEventListener("visibilitychange", onActivity);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!warning) return null;

  return (
    <div className="fixed inset-x-0 bottom-4 z-[60] flex justify-center px-4">
      <div className="flex flex-wrap items-center gap-3 rounded-xl border border-amber-500/30 bg-[#0a1128] px-4 py-3 shadow-2xl">
        <p className="text-sm text-amber-200">
          You have been idle. Signing out in a few seconds.
        </p>
        <button
          type="button"
          onClick={() => {
            setWarning(false);
            window.dispatchEvent(new Event("mousemove"));
          }}
          className="rounded-lg bg-emerald-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-emerald-700"
        >
          Stay signed in
        </button>
      </div>
    </div>
  );
}
