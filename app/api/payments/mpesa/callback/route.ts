import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/connect";
import { Payment } from "@/lib/db/models/Payment";
import { activateUserAfterPayment } from "@/lib/mpesa/activation";

export const dynamic = "force-dynamic";

interface CallbackItem {
  Name: string;
  Value?: string | number;
}

/**
 * Safaricom posts the result of the PIN prompt here.
 * Always answers 200 with ResultCode 0, otherwise Safaricom retries the callback.
 */
export async function POST(req: NextRequest) {
  const ack = () => NextResponse.json({ ResultCode: 0, ResultDesc: "Accepted" });

  try {
    const body = await req.json().catch(() => null);
    const callback = body?.Body?.stkCallback;

    if (!callback?.CheckoutRequestID) {
      return ack();
    }

    await connectDB();

    const payment = await Payment.findOne({
      mpesaCheckoutRequestId: callback.CheckoutRequestID,
    });

    if (!payment) {
      return ack();
    }

    const resultCode = Number(callback.ResultCode);
    const resultDesc: string = callback.ResultDesc || "";

    if (resultCode !== 0) {
      if (payment.status === "pending") {
        payment.status = "failed";
        payment.mpesaResultDesc = resultDesc;
        await payment.save();
      }
      return ack();
    }

    const items: CallbackItem[] = callback.CallbackMetadata?.Item ?? [];
    const receipt = items.find((i) => i.Name === "MpesaReceiptNumber")?.Value;
    const paidAmount = items.find((i) => i.Name === "Amount")?.Value;

    if (payment.status !== "successful") {
      payment.status = "successful";
      payment.mpesaReceiptNumber = receipt ? String(receipt) : undefined;
      payment.mpesaResultDesc = resultDesc || "Success";
      if (paidAmount != null) {
        const amount = Number(paidAmount);
        if (!Number.isNaN(amount) && amount > 0) payment.amount = amount;
      }
      await payment.save();
    }

    await activateUserAfterPayment(String(payment.userId), payment.amount);

    return ack();
  } catch (err) {
    console.error("M-Pesa callback error:", err);
    // Still acknowledge so Safaricom does not retry forever; the status
    // endpoint will reconcile the payment when the user polls.
    return ack();
  }
}
