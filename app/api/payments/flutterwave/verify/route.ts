import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/connect";
import { Payment } from "@/lib/db/models/Payment";
import { User } from "@/lib/db/models/User";
import { requireAuth } from "@/lib/auth/middleware";
import { verifyPayment } from "@/lib/flutterwave/verifyPayment";
import { distributeCommission } from "@/lib/commission/distributeCommission";
import { toErrorResponse, AppError } from "@/lib/utils/errors";

export async function GET(req: NextRequest) {
  try {
    const session = await requireAuth(req);
    await connectDB();

    const url = new URL(req.url);
    const txRef = url.searchParams.get("tx_ref");
    const transactionId = url.searchParams.get("transaction_id");

    if (!txRef && !transactionId) {
      throw new AppError("Missing transaction identifier", 422);
    }

    const payment = await Payment.findOne(
      txRef ? { txRef } : { flwTransactionId: Number(transactionId) }
    );
    if (!payment) throw new AppError("Payment not found", 404);

    if (String(payment.userId) !== session.userId && session.role !== "admin") {
      throw new AppError("Forbidden", 403);
    }

    if (payment.status === "successful") {
      return NextResponse.json({ status: "already_successful" });
    }

    const flwId = transactionId ?? payment.flwTransactionId;
    if (!flwId) throw new AppError("Missing Flutterwave transaction id", 422);

    const verification = await verifyPayment(flwId);

    if (verification.data.status !== "successful") {
      payment.status = "failed";
      await payment.save();
      throw new AppError("Payment not successful", 400, "PAYMENT_FAILED");
    }

    payment.status = "successful";
    payment.flwRef = verification.data.flw_ref;
    payment.flwTransactionId = verification.data.id;
    await payment.save();

    await User.findByIdAndUpdate(payment.userId, { hasPaid: true });

    const result = await distributeCommission(payment._id);

    return NextResponse.json({ status: "successful", distribution: result });
  } catch (err) {
    return toErrorResponse(err);
  }
}