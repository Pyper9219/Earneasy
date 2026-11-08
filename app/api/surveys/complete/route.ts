import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/connect";
import { requireAuth } from "@/lib/auth/middleware";
import { toErrorResponse, AppError } from "@/lib/utils/errors";
import { Survey } from "@/lib/models/Survey";
import { User } from "@/lib/db/models/User";
import { Wallet } from "@/lib/db/models/Wallet";

export const dynamic = "force-dynamic";

/**
 * Completes a survey and credits the reward.
 * The user is taken from the session cookie, never from the request body,
 * so only the signed-in account can be credited.
 */
export async function POST(req: NextRequest) {
  try {
    const session = await requireAuth(req);
    await connectDB();

    const body = await req.json().catch(() => ({}));
    const surveyId: string | undefined = body?.surveyId;
    if (!surveyId) throw new AppError("Missing surveyId", 422, "MISSING_SURVEY");

    const user = await User.findById(session.userId);
    if (!user) throw new AppError("User not found", 404, "NOT_FOUND");

    if (!user.hasPaid && !user.isActivated) {
      throw new AppError(
        "Account not active. Complete the activation payment first.",
        403,
        "NOT_ACTIVE"
      );
    }

    // Claim a slot atomically so concurrent requests cannot oversell.
    const survey = await Survey.findOneAndUpdate(
      { _id: surveyId, isActive: true, slotsRemaining: { $gt: 0 } },
      { $inc: { slotsRemaining: -1 } },
      { new: true }
    );

    if (!survey) {
      throw new AppError("Survey no longer available", 410, "UNAVAILABLE");
    }

    const reward = survey.rewardKES;

    // Credit the withdrawable wallet and the legacy counters together.
    await Wallet.updateOne(
      { userId: user._id },
      { $inc: { balance: reward, totalEarned: reward } },
      { upsert: true, setDefaultsOnInsert: true }
    );
    await User.updateOne(
      { _id: user._id },
      { $inc: { walletBalance: reward, totalSurveyEarnings: reward } }
    );

    return NextResponse.json({
      success: true,
      reward,
      message: `Credited KES ${reward} to your wallet.`,
    });
  } catch (err) {
    return toErrorResponse(err);
  }
}
