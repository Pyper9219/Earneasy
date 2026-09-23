import { connectDB } from "@/lib/db/connect";
import { User } from "@/lib/db/models/User";
import { Types } from "mongoose";
import ReferralTreeGraph from "@/components/dashboard/ReferralTreeGraph";
import type { ReferralNode } from "@/types/referral";

async function buildTree(userId: Types.ObjectId): Promise<ReferralNode | null> {
  const root = await User.findById(userId)
    .select("name email referralCode")
    .lean();
  if (!root) return null;

  async function fetchLevel(
    parentIds: Types.ObjectId[],
    level: 1 | 2 | 3
  ): Promise<ReferralNode[]> {
    if (level > 3 || parentIds.length === 0) return [];
    const users = await User.find({ referredBy: { $in: parentIds } })
      .select("name email referralCode createdAt")
      .lean();
    return Promise.all(
      users.map(async (u) => ({
        userId: String(u._id),
        name: u.name,
        email: u.email,
        code: u.referralCode,
        level,
        joinedAt: u.createdAt.toISOString(),
        children: await fetchLevel([u._id], (level + 1) as 1 | 2 | 3),
      }))
    );
  }

  return {
    userId: String(root._id),
    name: root.name,
    email: root.email,
    code: root.referralCode,
    level: 0 as unknown as 1,
    joinedAt: "",
    children: await fetchLevel([root._id], 1),
  };
}

export default async function AdminUserTreePage({
  params,
}: {
  params: { userId: string };
}) {
  await connectDB();
  const tree = await buildTree(new Types.ObjectId(params.userId));

  if (!tree) {
    return <p className="text-slate-500">User not found.</p>;
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold">{tree.name}&apos;s Tree</h1>
        <p className="text-slate-500 mt-1">{tree.email}</p>
      </header>
      <div className="bg-white rounded-2xl border p-6">
        <ReferralTreeGraph root={tree} />
      </div>
    </div>
  );
}