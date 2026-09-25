import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db/connect";
import { User, IUser } from "@/lib/db/models/User";
import { requireAuth } from "@/lib/auth/middleware";
import { toErrorResponse, AppError } from "@/lib/utils/errors";
import { Types } from "mongoose";

export const dynamic = "force-dynamic";

interface TreeNode {
  userId: string;
  name: string;
  email: string;
  code: string;
  level: 1 | 2 | 3;
  joinedAt: string;
  children: TreeNode[];
}

type TreeUser = Pick<IUser, "_id" | "name" | "email" | "referralCode" | "createdAt">;

export async function GET(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const session = await requireAuth(req);
    await connectDB();

    // Users may only see their own tree unless admin
    if (session.role !== "admin" && session.userId !== params.userId) {
      throw new AppError("Forbidden", 403, "FORBIDDEN");
    }

    const rootId = new Types.ObjectId(params.userId);
    const root = await User.findById(rootId)
      .select("name email referralCode")
      .lean<TreeUser | null>();
    if (!root) throw new AppError("User not found", 404, "NOT_FOUND");

    async function fetchLevel(
      parentIds: Types.ObjectId[],
      level: 1 | 2 | 3
    ): Promise<TreeNode[]> {
      if (level > 3 || parentIds.length === 0) return [];
      const users = await User.find({ referredBy: { $in: parentIds } })
        .select("name email referralCode createdAt")
        .lean<TreeUser[]>();
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

    const children = await fetchLevel([rootId], 1);

    return Response.json({
      root: {
        userId: String(root._id),
        name: root.name,
        email: root.email,
        code: root.referralCode,
        level: 0,
        joinedAt: "",
        children,
      },
    });
  } catch (err) {
    return toErrorResponse(err);
  }
}