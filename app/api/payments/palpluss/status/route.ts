import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/connect";
import { Payment } from "@/lib/db/models/Payment";
import { requireAuth } from "@/lib/auth/middleware";
import { toErrorResponse, AppError } from "@/lib/utils/errors";
import { getTransaction } from "@/lib/palpluss/client";
import { activateUserAfterPayment } from "@/lib/palpluss/activation";

export const dynamic = "force-dynamic";

/** Polled by the activation page while the M-Pesa prompt is on the phone. */
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
      return NextResponse.json({ status: "successful", receipt: payment.receipt ?? null });
    }

    if (payment.status === "failed") {
      return NextResponse.json({
        status: "failed",
        message: payment.providerResultDesc || "The payment was not completed.",
      });
    }

    if (payment.providerTransactionId) {
      try {
        const tx = await getTransaction(payment.providerTransactionId);

        if (tx.status === "SUCCESS") {
          payment.status = "successful";
          payment.receipt = tx.mpesaReceipt ?? undefined;
          payment.providerResultDesc = tx.resultDescription ?? "Success";
          await payment.save();
          await activateUserAfterPayment(String(payment.userId), payment.amount);
          return NextResponse.json({
            status: "successful",
            receipt: payment.receipt ?? null,
          });
        }

        if (tx.status === "FAILED" || tx.status === "CANCELLED" || tx.status === "REVERSED") {
          payment.status = "failed";
          payment.providerResultDesc = tx.resultDescription || tx.status;
          await payment.save();
          return NextResponse.json({
            status: "failed",
            message: payment.providerResultDesc,
          });
        }

        return NextResponse.json({
          status: "pending",
          providerStatus: tx.status,
          message:
            tx.status === "PROCESSING"
              ? "PIN received. Waiting for M-Pesa to confirm."
              : "Waiting for you to enter your M-Pesa PIN.",
        });
      } catch (err) {
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
