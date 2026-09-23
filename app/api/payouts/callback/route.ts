import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/connect";
import { Payout } from "@/lib/db/models/Payout";
import { Wallet } from "@/lib/db/models/Wallet";
import { verifyWebhookSignature } from "@/lib/flutterwave/verifyWebhookSignature";

export async function POST(req: NextRequest) {
  const signature = req.headers.get("verif-hash");
  if (!verifyWebhookSignature(signature)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  try {
    await connectDB();
    const payload = (await req.json()) as {
      event?: string;
      data?: { reference?: string; status?: string };
    };

    const reference = payload.data?.reference;
    const status = payload.data?.status;

    if (!reference) {
      return NextResponse.json({ received: true, ignored: true });
    }

    const payout = await Payout.findOne({ reference });
    if (!payout) {
      return NextResponse.json({ received: true, ignored: "unknown_ref" });
    }

    if (status === "SUCCESSFUL" && payout.status !== "completed") {
      payout.status = "completed";
      await payout.save();

      await Wallet.findOneAndUpdate(
        { userId: payout.userId },
        { $inc: { totalWithdrawn: payout.amount } }
      );
    } else if (status === "FAILED" && payout.status !== "failed") {
      payout.status = "failed";
      payout.failureReason = "Transfer failed per provider";
      await payout.save();

      // Refund
      await Wallet.findOneAndUpdate(
        { userId: payout.userId },
        { $inc: { balance: payout.amount } }
      );
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("[Payout Callback Error]", err);
    return NextResponse.json({ received: true });
  }
}