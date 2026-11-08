import { NextRequest, NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { connectDB } from "@/lib/db/connect";
import { Payment } from "@/lib/db/models/Payment";
import { User } from "@/lib/db/models/User";
import { requireAuth } from "@/lib/auth/middleware";
import { toErrorResponse, AppError } from "@/lib/utils/errors";
import { CLIENT_PRICE_KES, CURRENCY } from "@/lib/utils/constants";
import { normalizeMpesaPhone } from "@/lib/mpesa/phone";
import { stkPush } from "@/lib/mpesa/stkPush";
import { getMpesaConfig } from "@/lib/mpesa/config";

export const dynamic = "force-dynamic";

/** Creates a pending payment and sends the M-Pesa PIN prompt to the user's phone. */
export async function POST(req: NextRequest) {
  try {
    const session = await requireAuth(req);
    await connectDB();

    const user = await User.findById(session.userId);
    if (!user) throw new AppError("User not found", 404, "NOT_FOUND");

    if (user.hasPaid) {
      throw new AppError("Your account is already active", 409, "ALREADY_PAID");
    }

    const cfg = getMpesaConfig();
    if (cfg.missing.length > 0) {
      throw new AppError(
        `M-Pesa is not configured yet. Missing: ${cfg.missing.join(", ")}`,
        503,
        "MPESA_NOT_CONFIGURED"
      );
    }

    const body = await req.json().catch(() => ({}));
    const rawPhone: string = body?.phone || user.phone || "";
    const phone = normalizeMpesaPhone(rawPhone);

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

    // Daraja limits AccountReference to 12 characters.
    const txRef = `EE${Date.now().toString(36).slice(-6)}${randomBytes(2)
      .toString("hex")
      .toUpperCase()}`.toUpperCase();

    const payment = await Payment.create({
      userId: user._id,
      amount: CLIENT_PRICE_KES,
      currency: CURRENCY,
      status: "pending",
      txRef,
      paymentMethod: "mpesa",
    });

    try {
      const push = await stkPush({
        phone,
        amount: CLIENT_PRICE_KES,
        accountReference: txRef,
      });

      payment.transactionId = push.CheckoutRequestID;
      payment.mpesaCheckoutRequestId = push.CheckoutRequestID;
      payment.mpesaMerchantRequestId = push.MerchantRequestID;
      await payment.save();

      return NextResponse.json({
        txRef,
        checkoutRequestId: push.CheckoutRequestID,
        customerMessage:
          push.CustomerMessage ||
          "Check your phone and enter your M-Pesa PIN to complete payment.",
        amount: CLIENT_PRICE_KES,
      });
    } catch (err) {
      payment.status = "failed";
      payment.mpesaResultDesc = (err as Error).message;
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
