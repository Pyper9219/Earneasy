import Badge from "@/components/ui/Badge";
import { formatDateTime, formatKES } from "@/lib/utils/format";

interface Entry {
  _id: string;
  level: number;
  amount: number;
  createdAt: string;
}

export default function RecentCommissionList({
  entries,
}: {
  entries: Entry[];
}) {
  if (entries.length === 0) {
    return (
      <p className="text-sm text-slate-500 py-4">No commissions yet.</p>
    );
  }

  return (
    <ul className="divide-y">
      {entries.map((e) => (
        <li key={e._id} className="py-3 flex items-center justify-between">
          <div>
            <Badge variant="info">Level {e.level}</Badge>
            <p className="text-xs text-slate-500 mt-1">
              {formatDateTime(e.createdAt)}
            </p>
          </div>
          <span className="font-medium text-emerald-700">
            + {formatKES(e.amount)}
          </span>
        </li>
      ))}
    </ul>
  );
}