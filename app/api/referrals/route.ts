import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db/connect";
import { User } from "@/lib/db/models/User";
import { requireAuth } from "@/lib/auth/middleware";
import { toErrorResponse } from "@/lib/utils/errors";
import { Types } from "mongoose";

export async function GET(req: NextRequest) {
  try {
    const session = await requireAuth(req);
    await connectDB();
    const rootId = new Types.ObjectId(session.userId);

    const l1 = await User.find({ referredBy: rootId })
      .select("name email referralCode createdAt")
      .lean();
    const l2 = await User.find({
      referredBy: { $in: l1.map((u) => u._id) },
    })
      .select("name email referralCode referredBy createdAt")
      .lean();
    const l3 = await User.find({
      referredBy: { $in: l2.map((u) => u._id) },
    })
      .select("name email referralCode referredBy createdAt")
      .lean();

    return Response.json({
      direct: l1,
      level2: l2,
      level3: l3,
      counts: { l1: l1.length, l2: l2.length, l3: l3.length },
    });
  } catch (err) {
    return toErrorResponse(err);
  }
}