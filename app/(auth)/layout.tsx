import Link from "next/link";
import type { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md">
        <Link
          href="/"
          className="block text-center text-2xl font-bold text-emerald-600 mb-8"
        >
          EarnEasy
        </Link>
        <div className="bg-white rounded-2xl shadow-sm border p-8">{children}</div>
      </div>
    </div>
  );
}