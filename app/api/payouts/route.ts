import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/connect";
import { Payout } from "@/lib/db/models/Payout";
import { Wallet } from "@/lib/db/models/Wallet";
import { requireAuth } from "@/lib/auth/middleware";
import { payoutRequestSchema } from "@/lib/utils/validators";
import { toErrorResponse, AppError } from "@/lib/utils/errors";
import { MIN_PAYOUT_KES } from "@/lib/utils/constants";
import { customAlphabet } from "nanoid";

const ref = customAlphabet("ABCDEFGHJKLMNPQRSTUVWXYZ0123456789", 12);

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const session = await requireAuth(req);
    await connectDB();

    const filter =
      session.role === "admin" ? {} : { userId: session.userId };

    const payouts = await Payout.find(filter)
      .sort({ createdAt: -1 })
      .limit(100)
      .lean();

    return NextResponse.json({ payouts });
  } catch (err) {
    return toErrorResponse(err);
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await requireAuth(req);
    await connectDB();

    const body = await req.json();
    const parsed = payoutRequestSchema.safeParse(body);
    if (!parsed.success) {
      throw new AppError(parsed.error.errors[0]?.message ?? "Invalid input", 422);
    }
    const { amount, destination } = parsed.data;

    if (amount < MIN_PAYOUT_KES) {
      throw new AppError(
        `Minimum payout is KES ${MIN_PAYOUT_KES}`,
        422,
        "MIN_PAYOUT"
      );
    }

    const wallet = await Wallet.findOne({ userId: session.userId });
    if (!wallet || wallet.balance < amount) {
      throw new AppError("Insufficient balance", 400, "INSUFFICIENT_BALANCE");
    }

    // Hold funds: debit immediately
    wallet.balance -= amount;
    await wallet.save();

    const payout = await Payout.create({
      userId: session.userId,
      amount,
      status: "pending",
      destination,
      reference: `PO_${ref()}`,
    });

    return NextResponse.json({ payout }, { status: 201 });
  } catch (err) {
    return toErrorResponse(err);
  }
}