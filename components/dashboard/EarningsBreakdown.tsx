"use client";

interface Props {
  totals: { level1: number; level2: number; level3: number };
  counts: { level1: number; level2: number; level3: number };
}

export default function EarningsBreakdown({ totals, counts }: Props) {
  const levels = [
    { name: "Level 1", amount: totals.level1, count: counts.level1, rate: 250 },
    { name: "Level 2", amount: totals.level2, count: counts.level2, rate: 100 },
    { name: "Level 3", amount: totals.level3, count: counts.level3, rate: 50 },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {levels.map((l) => (
        <div key={l.name} className="rounded-xl border p-5 bg-white">
          <p className="text-sm text-slate-500">{l.name} · KES {l.rate}/ref</p>
          <p className="text-2xl font-bold mt-1">KES {l.amount}</p>
          <p className="text-xs text-slate-500 mt-1">{l.count} referrals</p>
        </div>
      ))}
    </div>
  );
}