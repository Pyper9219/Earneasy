import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/connect";
import { User } from "@/lib/db/models/User";
import { requireAuth } from "@/lib/auth/middleware";
import { createReferralCodeForUser } from "@/lib/referral/generateCode";
import { toErrorResponse } from "@/lib/utils/errors";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const session = await requireAuth(req);
    await connectDB();
    const user = await User.findById(session.userId);
    if (!user) throw new Error("User not found");

    if (user.referralCode) {
      return NextResponse.json({ code: user.referralCode });
    }

    const doc = await createReferralCodeForUser(user._id);
    return NextResponse.json({ code: doc.code });
  } catch (err) {
    return toErrorResponse(err);
  }
}