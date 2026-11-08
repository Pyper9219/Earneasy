import { NextRequest, NextResponse } from "next/server";
import { Types } from "mongoose";
import { connectDB } from "@/lib/db/connect";
import { User } from "@/lib/db/models/User";
import { Wallet } from "@/lib/db/models/Wallet";
import { CommissionLedger } from "@/lib/db/models/CommissionLedger";
import { requireAuth } from "@/lib/auth/middleware";
import { toErrorResponse, AppError } from "@/lib/utils/errors";

export const dynamic = "force-dynamic";

/** Everything the dashboard needs in one call. */
export async function GET(req: NextRequest) {
  try {
    const session = await requireAuth(req);
    await connectDB();

    const user = await User.findById(session.userId)
      .select(
        "name email phone role referralCode hasPaid createdAt isActivated walletBalance chatEarnings"
      )
      .lean<{
        name?: string;
        email?: string;
        phone?: string;
        role?: string;
        referralCode?: string;
        hasPaid?: boolean;
        isActivated?: boolean;
        createdAt?: Date;
        walletBalance?: number;
        chatEarnings?: number;
      } | null>();

    if (!user) throw new AppError("User not found", 404, "NOT_FOUND");

    const userId = new Types.ObjectId(session.userId);

    const [wallet, commissionTotals, referralCount] = await Promise.all([
      Wallet.findOne({ userId }).select("balance totalEarned totalWithdrawn").lean<{
        balance?: number;
        totalEarned?: number;
        totalWithdrawn?: number;
      } | null>(),
      CommissionLedger.aggregate<{ _id: number; total: number }>([
        { $match: { userId } },
        { $group: { _id: "$level", total: { $sum: "$amount" } } },
      ]),
      User.countDocuments({ referredBy: userId }),
    ]);

    const byLevel: Record<string, number> = {};
    let referralEarnings = 0;
    for (const row of commissionTotals) {
      byLevel[String(row._id)] = row.total;
      referralEarnings += row.total;
    }

    return NextResponse.json({
      user: {
        ...user,
        walletBalance: wallet?.balance ?? user.walletBalance ?? 0,
        totalWithdrawn: wallet?.totalWithdrawn ?? 0,
        referralEarnings,
        referralByLevel: byLevel,
        referralCount,
        chatEarnings: user.chatEarnings ?? 0,
      },
    });
  } catch (err) {
    return toErrorResponse(err);
  }
}
