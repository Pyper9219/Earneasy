import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/connect";
import { Payment } from "@/lib/db/models/Payment";
import { User } from "@/lib/db/models/User";
import { verifyWebhookSignature } from "@/lib/flutterwave/verifyWebhookSignature";
import { distributeCommission } from "@/lib/commission/distributeCommission";
import type { FlutterwaveWebhookPayload } from "@/types/flutterwave";

export async function POST(req: NextRequest) {
  const signature = req.headers.get("verif-hash");

  if (!verifyWebhookSignature(signature)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let payload: FlutterwaveWebhookPayload;
  try {
    payload = (await req.json()) as FlutterwaveWebhookPayload;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  // Acknowledge only charge completed events
  if (payload.event !== "charge.completed") {
    return NextResponse.json({ received: true, ignored: true });
  }

  try {
    await connectDB();

    const txRef = payload.data.tx_ref;
    const payment = await Payment.findOne({ txRef });
    if (!payment) {
      return NextResponse.json({ received: true, ignored: "unknown_tx_ref" });
    }

    // Idempotency: if already successful, still call distribute (it's idempotent)
    if (payload.data.status === "successful") {
      payment.status = "successful";
      payment.flwRef = payload.data.flw_ref;
      payment.flwTransactionId = payload.data.id;
      await payment.save();

      await User.findByIdAndUpdate(payment.userId, { hasPaid: true });

      await distributeCommission(payment._id);
    } else {
      payment.status = "failed";
      await payment.save();
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("[Flutterwave Webhook Error]", err);
    // Still return 200 to avoid Flutterwave retries storming; log for manual review.
    return NextResponse.json({ received: true, error: "processing_failed" });
  }
}