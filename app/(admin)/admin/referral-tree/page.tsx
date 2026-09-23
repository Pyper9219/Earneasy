import { connectDB } from "@/lib/db/connect";
import { User } from "@/lib/db/models/User";

export default async function AdminReferralTreePage() {
  await connectDB();
  const roots = await User.find({ referredBy: null })
    .select("name email referralCode createdAt")
    .limit(50)
    .lean();

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold">Referral Trees</h1>
        <p className="text-slate-500 mt-1">
          Top-level users (no inviter). {roots.length} shown.
        </p>
      </header>

      <div className="bg-white rounded-2xl border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-600">
            <tr>
              <th className="text-left px-4 py-3">Name</th>
              <th className="text-left px-4 py-3">Email</th>
              <th className="text-left px-4 py-3">Code</th>
              <th className="text-left px-4 py-3">Joined</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {roots.map((u) => (
              <tr key={String(u._id)}>
                <td className="px-4 py-3 font-medium">{u.name}</td>
                <td className="px-4 py-3 text-slate-500">{u.email}</td>
                <td className="px-4 py-3 font-mono text-xs">{u.referralCode}</td>
                <td className="px-4 py-3">
                  {new Date(u.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}