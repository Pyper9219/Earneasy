"use client";

import Link from "next/link";
import { useState } from "react";

export default function MobileNavButton({
  items,
  role,
}: {
  items: { href: string; label: string }[];
  role?: string | null;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <div className="fixed top-4 right-4 z-50">
        <button
          aria-label="Open menu"
          onClick={() => setOpen((s) => !s)}
          className="h-12 w-12 rounded-full bg-emerald-600 text-white shadow-lg flex items-center justify-center"
        >
          {/* simple knob icon */}
          <span className="block w-4 h-4 bg-white rounded-full" />
        </button>
        {open && (
          <div className="mt-3 w-56 bg-white rounded-xl shadow-lg border overflow-hidden">
            <nav className="p-2">
              {items.map((it) => (
                <Link
                  key={it.href}
                  href={it.href}
                  onClick={() => setOpen(false)}
                  className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100"
                >
                  {it.label}
                </Link>
              ))}
              {role === "admin" && (
                <Link
                  href="/admin"
                  onClick={() => setOpen(false)}
                  className="block px-3 py-2 rounded-lg text-sm font-medium text-amber-700 hover:bg-amber-50"
                >
                  Admin
                </Link>
              )}
            </nav>
          </div>
        )}
      </div>
    </div>
  );
}
