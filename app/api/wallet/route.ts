import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/connect";
import { Wallet } from "@/lib/db/models/Wallet";
import { requireAuth } from "@/lib/auth/middleware";
import { toErrorResponse } from "@/lib/utils/errors";

export async function GET(req: NextRequest) {
  try {
    const session = await requireAuth(req);
    await connectDB();

    let wallet = await Wallet.findOne({ userId: session.userId }).lean();
    if (!wallet) {
      wallet = {
        userId: session.userId,
        balance: 0,
        totalEarned: 0,
        totalWithdrawn: 0,
      } as unknown as typeof wallet;
    }

    return NextResponse.json({ wallet });
  } catch (err) {
    return toErrorResponse(err);
  }
}