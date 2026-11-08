import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/connect";
import { Payment } from "@/lib/db/models/Payment";
import { Payout } from "@/lib/db/models/Payout";
import { Wallet } from "@/lib/db/models/Wallet";
import { activateUserAfterPayment } from "@/lib/palpluss/activation";
import { getTransaction } from "@/lib/palpluss/client";

export const dynamic = "force-dynamic";

/**
 * PalPluss posts here when a transaction reaches a terminal state.
 * The payload is treated as a hint only: the status is re-read from the API,
 * so a forged or stale callback can never activate an account or release money.
 *
 * Handles both directions:
 *   STK  (money in)  -> activate the paying user
 *   B2C  (money out) -> close the withdrawal, or refund it on failure
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
    await connectDB();

    const terminalStates = ["SUCCESS", "COMPLETED", "FAILED", "REVERSED", "CANCELLED"];
    if (!terminalStates.includes(tx.status)) {
      return NextResponse.json({ received: true });
    }

    // ---------- money out: B2C withdrawal ----------
    if (tx.type === "B2C") {
      const payout = await Payout.findOne({ transactionId });
      if (!payout) return NextResponse.json({ received: true });

      const succeeded = tx.status === "SUCCESS" || tx.status === "COMPLETED";

      if (succeeded && payout.status !== "completed") {
        payout.status = "completed";
        payout.paidAt = new Date();
        payout.failureReason = undefined;
        await payout.save();

        await Wallet.findOneAndUpdate(
          { userId: payout.userId },
          { $inc: { totalWithdrawn: payout.amount } }
        );
      } else if (!succeeded && payout.status !== "failed") {
        // Return the held money exactly once.
        if (payout.status !== "completed") {
          await Wallet.findOneAndUpdate(
            { userId: payout.userId },
            { $inc: { balance: payout.amount } }
          );
        }
        payout.status = "failed";
        payout.failureReason = tx.resultDescription || tx.status;
        await payout.save();
      }

      return NextResponse.json({ received: true });
    }

    // ---------- money in: STK activation payment ----------
    if (tx.status !== "SUCCESS") {
      return NextResponse.json({ received: true });
    }

    const payment = await Payment.findOne({
      $or: [
        { providerTransactionId: transactionId },
        { transactionId },
        { txRef: tx.accountReference },
      ],
    });

    if (!payment) return NextResponse.json({ received: true });

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
