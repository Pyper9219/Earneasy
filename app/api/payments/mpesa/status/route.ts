import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/connect";
import { Payment } from "@/lib/db/models/Payment";
import { requireAuth } from "@/lib/auth/middleware";
import { toErrorResponse, AppError } from "@/lib/utils/errors";
import { stkQuery } from "@/lib/mpesa/stkQuery";
import { activateUserAfterPayment } from "@/lib/mpesa/activation";

export const dynamic = "force-dynamic";

/**
 * Polled by the activation page. Falls back to the STK query API
 * when Safaricom's callback has not arrived yet.
 */
export async function GET(req: NextRequest) {
  try {
    const session = await requireAuth(req);
    await connectDB();

    const txRef = new URL(req.url).searchParams.get("tx_ref");
    if (!txRef) throw new AppError("Missing tx_ref", 422, "MISSING_TX_REF");

    const payment = await Payment.findOne({ txRef });
    if (!payment) throw new AppError("Payment not found", 404, "NOT_FOUND");

    if (String(payment.userId) !== session.userId && session.role !== "admin") {
      throw new AppError("Forbidden", 403, "FORBIDDEN");
    }

    if (payment.status === "successful") {
      await activateUserAfterPayment(String(payment.userId), payment.amount);
      return NextResponse.json({
        status: "successful",
        receipt: payment.mpesaReceiptNumber ?? null,
      });
    }

    if (payment.status === "failed") {
      return NextResponse.json({
        status: "failed",
        message: payment.mpesaResultDesc || "Payment was not completed",
      });
    }

    if (payment.mpesaCheckoutRequestId) {
      try {
        const result = await stkQuery(payment.mpesaCheckoutRequestId);

        if (result.ResultCode === "0") {
          payment.status = "successful";
          payment.mpesaResultDesc = result.ResultDesc || "Success";
          await payment.save();
          await activateUserAfterPayment(String(payment.userId), payment.amount);
          return NextResponse.json({
            status: "successful",
            receipt: payment.mpesaReceiptNumber ?? null,
          });
        }

        // 1032 cancelled, 1037 timeout, 1 insufficient funds and friends.
        if (result.ResultCode && result.ResultCode !== "0") {
          payment.status = "failed";
          payment.mpesaResultDesc = result.ResultDesc || `ResultCode ${result.ResultCode}`;
          await payment.save();
          return NextResponse.json({
            status: "failed",
            message: payment.mpesaResultDesc,
          });
        }
      } catch (err) {
        // Query can fail while the push is still on screen; stay pending.
        return NextResponse.json({
          status: "pending",
          message: (err as Error).message,
        });
      }
    }

    return NextResponse.json({
      status: "pending",
      message: "Waiting for you to enter your M-Pesa PIN.",
    });
  } catch (err) {
    return toErrorResponse(err);
  }
}
