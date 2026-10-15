import Link from "next/link";
import type { ReactNode } from "react";

export default function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900">
      <header className="border-b">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-emerald-600">
            EarnEasy
          </Link>
          <nav className="flex items-center gap-3">
            <Link href="/login" className="px-4 py-2 text-sm font-medium hover:underline">
              Login
            </Link>
            <Link
              href="/register"
              className="px-4 py-2 text-sm font-medium rounded-lg bg-emerald-600 text-white hover:bg-emerald-700"
            >
              Get Started
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="border-t py-6 text-center text-sm text-slate-500">
        © {new Date().getFullYear()} EarnEasy. All rights reserved.
      </footer>
    </div>
  );
}