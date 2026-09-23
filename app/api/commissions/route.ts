import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/connect";
import { CommissionLedger } from "@/lib/db/models/CommissionLedger";
import { requireAuth } from "@/lib/auth/middleware";
import { toErrorResponse } from "@/lib/utils/errors";
import { Types } from "mongoose";

export async function GET(req: NextRequest) {
  try {
    const session = await requireAuth(req);
    await connectDB();

    const url = new URL(req.url);
    const level = url.searchParams.get("level");
    const limit = Math.min(Number(url.searchParams.get("limit") ?? 50), 200);

    const filter: Record<string, unknown> = {
      userId: new Types.ObjectId(session.userId),
    };
    if (level) filter.level = Number(level);

    const entries = await CommissionLedger.find(filter)
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    const totals = await CommissionLedger.aggregate([
      { $match: { userId: new Types.ObjectId(session.userId) } },
      { $group: { _id: "$level", total: { $sum: "$amount" }, count: { $sum: 1 } } },
    ]);

    return NextResponse.json({ entries, totals });
  } catch (err) {
    return toErrorResponse(err);
  }
}