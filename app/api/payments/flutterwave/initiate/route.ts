import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/connect";
import { Payment } from "@/lib/db/models/Payment";
import { User } from "@/lib/db/models/User";
import { requireAuth } from "@/lib/auth/middleware";
import { initiatePayment } from "@/lib/flutterwave/initiatePayment";
import { toErrorResponse, AppError } from "@/lib/utils/errors";
import { CLIENT_PRICE_KES, CURRENCY } from "@/lib/utils/constants";
import { randomBytes } from "crypto";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const session = await requireAuth(req);
    await connectDB();

    const user = await User.findById(session.userId);
    if (!user) throw new AppError("User not found", 404);

    if (user.hasPaid) {
      throw new AppError("You have already paid", 409, "ALREADY_PAID");
    }

    const txRef = `earneasy_${user._id}_${Date.now()}_${randomBytes(4).toString("hex")}`;

    await Payment.create({
      userId: user._id,
      amount: CLIENT_PRICE_KES,
      currency: CURRENCY,
      status: "pending",
      txRef,
    });

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    const result = await initiatePayment({
      tx_ref: txRef,
      amount: CLIENT_PRICE_KES,
      currency: CURRENCY,
      redirect_url: `${appUrl}/dashboard?payment=verify&tx_ref=${txRef}`,
      customer: {
        email: user.email,
        name: user.name,
        phonenumber: user.phone,
      },
      customizations: {
        title: "EarnEasy Membership",
        description: `KES ${CLIENT_PRICE_KES} one-time payment`,
      },
      meta: { userId: String(user._id), txRef },
    });

    return NextResponse.json({
      link: result.data.link,
      txRef,
    });
  } catch (err) {
    return toErrorResponse(err);
  }
}