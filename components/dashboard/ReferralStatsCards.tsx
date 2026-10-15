import { formatKES } from "@/lib/utils/format";

interface Props {
  balance: number;
  totalEarned: number;
  totalWithdrawn: number;
  referralCount: number;
}

export default function ReferralStatsCards({
  balance,
  totalEarned,
  totalWithdrawn,
  referralCount,
}: Props) {
  const items = [
    { label: "Wallet Balance", value: formatKES(balance), accent: true },
    { label: "Total Earned", value: formatKES(totalEarned) },
    { label: "Withdrawn", value: formatKES(totalWithdrawn) },
    { label: "Referrals", value: String(referralCount) },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {items.map((item) => (
        <div
          key={item.label}
          className={`rounded-2xl border p-5 bg-white ${
            item.accent ? "ring-2 ring-emerald-500" : ""
          }`}
        >
          <p className="text-sm text-slate-500">{item.label}</p>
          <p className="text-2xl font-bold mt-1">{item.value}</p>
        </div>
      ))}
    </div>
  );
}