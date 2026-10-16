import type { ReactNode } from "react";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#050b1a] text-slate-200">
      {children}
    </div>
  );
}
