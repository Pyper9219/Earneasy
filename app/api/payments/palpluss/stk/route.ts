import { NextRequest, NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { connectDB } from "@/lib/db/connect";
import { Payment } from "@/lib/db/models/Payment";
import { User } from "@/lib/db/models/User";
import { requireAuth } from "@/lib/auth/middleware";
import { toErrorResponse, AppError } from "@/lib/utils/errors";
import { CLIENT_PRICE_KES, CURRENCY } from "@/lib/utils/constants";
import { normalizeKenyanPhone } from "@/lib/palpluss/phone";
import { initiateStkPush } from "@/lib/palpluss/client";
import { getPalplussConfig } from "@/lib/palpluss/config";

export const dynamic = "force-dynamic";

/** Creates a pending payment and triggers the M-Pesa prompt on the user's phone. */
export async function POST(req: NextRequest) {
  try {
    const session = await requireAuth(req);
    await connectDB();

    const user = await User.findById(session.userId);
    if (!user) throw new AppError("User not found", 404, "NOT_FOUND");

    if (user.hasPaid) {
      throw new AppError("Your account is already active", 409, "ALREADY_PAID");
    }

    const cfg = getPalplussConfig();
    if (cfg.missing.length > 0) {
      throw new AppError(
        `PalPluss is not configured yet. Missing: ${cfg.missing.join(", ")}`,
        503,
        "PALPLUSS_NOT_CONFIGURED"
      );
    }

    const body = await req.json().catch(() => ({}));
    const rawPhone: string = body?.phone || user.phone || "";
    const phone = normalizeKenyanPhone(rawPhone);

    if (!phone) {
      throw new AppError(
        "Enter a valid Safaricom number, for example 0712345678",
        422,
        "INVALID_PHONE"
      );
    }

    if (user.phone !== phone) {
      user.phone = phone;
      await user.save();
    }

    const txRef = `EE${Date.now().toString(36).slice(-6)}${randomBytes(2)
      .toString("hex")}`.toUpperCase();

    const payment = await Payment.create({
      userId: user._id,
      amount: CLIENT_PRICE_KES,
      currency: CURRENCY,
      status: "pending",
      txRef,
      paymentMethod: "palpluss_mpesa",
    });

    try {
      const tx = await initiateStkPush({
        phone,
        amount: CLIENT_PRICE_KES,
        accountReference: txRef,
        transactionDesc: "EarnEasy activation",
      });

      payment.providerTransactionId = tx.transactionId;
      payment.providerCheckoutId = tx.providerCheckoutId;
      payment.transactionId = tx.transactionId;
      await payment.save();

      return NextResponse.json({
        txRef,
        transactionId: tx.transactionId,
        status: tx.status,
        amount: CLIENT_PRICE_KES,
        customerMessage:
          "Check your phone and enter your M-Pesa PIN to complete payment.",
      });
    } catch (err) {
      payment.status = "failed";
      payment.providerResultDesc = (err as Error).message;
      await payment.save();
      throw new AppError(
        (err as Error).message || "Could not send the M-Pesa prompt",
        502,
        "STK_FAILED"
      );
    }
  } catch (err) {
    return toErrorResponse(err);
  }
}
