import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/connect";
import { Payment } from "@/lib/db/models/Payment";
import { activateUserAfterPayment } from "@/lib/palpluss/activation";
import { getTransaction } from "@/lib/palpluss/client";

export const dynamic = "force-dynamic";

/**
 * PalPluss posts here when a transaction reaches a terminal state.
 * The payload is treated as a hint only: the status is re-read from the API
 * so a forged or stale callback can never activate an account.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    const transactionId: string | undefined =
      body?.transaction?.id || body?.data?.transactionId;

    if (!transactionId) {
      return NextResponse.json({ received: true });
    }

    const tx = await getTransaction(transactionId);

    if (tx.status !== "SUCCESS") {
      return NextResponse.json({ received: true });
    }

    await connectDB();

    const payment = await Payment.findOne({
      $or: [
        { providerTransactionId: transactionId },
        { transactionId },
        { txRef: tx.accountReference },
      ],
    });

    if (!payment) {
      return NextResponse.json({ received: true });
    }

    if (payment.status !== "successful") {
      payment.status = "successful";
      payment.providerTransactionId = transactionId;
      payment.providerCheckoutId = tx.providerCheckoutId;
      payment.receipt = tx.mpesaReceipt ?? undefined;
      payment.providerResultDesc = tx.resultDescription ?? "Success";
      if (tx.amount && tx.amount > 0) payment.amount = tx.amount;
      await payment.save();
    }

    await activateUserAfterPayment(String(payment.userId), payment.amount);

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("PalPluss webhook error:", err);
    // The status endpoint reconciles anything missed here.
    return NextResponse.json({ received: true });
  }
}
