import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifySessionToken, SESSION_COOKIE } from "@/lib/auth/session";
import { connectDB } from "@/lib/db/connect";
import { User } from "@/lib/db/models/User";
import { Types } from "mongoose";

async function getTree(userId: string) {
  await connectDB();
  const rootId = new Types.ObjectId(userId);

  const l1 = await User.find({ referredBy: rootId })
    .select("name email referralCode createdAt")
    .lean();
  const l1Ids = l1.map((u) => u._id);

  const l2 = await User.find({ referredBy: { $in: l1Ids } })
    .select("name email referralCode referredBy createdAt")
    .lean();
  const l2Ids = l2.map((u) => u._id);

  const l3 = await User.find({ referredBy: { $in: l2Ids } })
    .select("name email referralCode referredBy createdAt")
    .lean();

  return { l1, l2, l3 };
}

export default async function ReferralsPage() {
  const token = cookies().get(SESSION_COOKIE)?.value;
  const session = token ? await verifySessionToken(token) : null;
  if (!session) redirect("/login");

  const { l1, l2, l3 } = await getTree(session.userId);

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold">Your Referral Tree</h1>
        <p className="text-slate-500 mt-1">
          {l1.length} direct · {l2.length} level 2 · {l3.length} level 3
        </p>
      </header>

      <Section title={`Level 1 — Direct (${l1.length})`} users={l1} />
      <Section title={`Level 2 (${l2.length})`} users={l2} />
      <Section title={`Level 3 (${l3.length})`} users={l3} />
    </div>
  );
}

function Section({
  title,
  users,
}: {
  title: string;
  users: Array<{ _id: unknown; name: string; email: string; referralCode: string }>;
}) {
  return (
    <section className="bg-white rounded-2xl border p-6">
      <h2 className="font-semibold text-lg mb-4">{title}</h2>
      {users.length === 0 ? (
        <p className="text-sm text-slate-500">No referrals yet.</p>
      ) : (
        <ul className="divide-y">
          {users.map((u) => (
            <li key={String(u._id)} className="py-3 flex items-center justify-between">
              <div>
                <p className="font-medium">{u.name}</p>
                <p className="text-sm text-slate-500">{u.email}</p>
              </div>
              <span className="font-mono text-xs bg-slate-100 px-2 py-1 rounded">
                {u.referralCode}
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}