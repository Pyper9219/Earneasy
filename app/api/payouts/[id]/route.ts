import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/connect";
import { Payout } from "@/lib/db/models/Payout";
import { Wallet } from "@/lib/db/models/Wallet";
import { requireAdmin } from "@/lib/auth/middleware";
import { initiateTransfer } from "@/lib/flutterwave/initiateTransfer";
import { toErrorResponse, AppError } from "@/lib/utils/errors";
import { z } from "zod";

export const dynamic = "force-dynamic";

const actionSchema = z.object({
  action: z.enum(["approve", "reject"]),
  reason: z.string().optional(),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const admin = await requireAdmin(req);
    await connectDB();

    const body = await req.json();
    const parsed = actionSchema.safeParse(body);
    if (!parsed.success) throw new AppError("Invalid action", 422);
    const { action, reason } = parsed.data;

    const payout = await Payout.findById(params.id);
    if (!payout) throw new AppError("Payout not found", 404, "NOT_FOUND");
    if (payout.status !== "pending") {
      throw new AppError("Payout already processed", 409, "ALREADY_PROCESSED");
    }

    if (action === "reject") {
      // Refund balance
      await Wallet.findOneAndUpdate(
        { userId: payout.userId },
        { $inc: { balance: payout.amount } }
      );
      payout.status = "failed";
      payout.failureReason = reason ?? "Rejected by admin";
      payout.processedBy = admin.userId as unknown as typeof payout.processedBy;
      await payout.save();
      return NextResponse.json({ payout });
    }

    // Approve → initiate Flutterwave transfer
    payout.status = "processing";
    payout.processedBy = admin.userId as unknown as typeof payout.processedBy;
    await payout.save();

    try {
      const transfer = await initiateTransfer({
        account_bank: payout.destination.bankCode ?? "",
        account_number: payout.destination.accountNumber,
        amount: payout.amount,
        currency: "KES",
        narration: `EarnEasy payout ${payout.reference}`,
        reference: payout.reference,
        callback_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/payouts/${payout._id}`,
      });

      payout.status =
        transfer?.data?.status === "SUCCESSFUL" ? "completed" : "processing";
      await payout.save();

      if (payout.status === "completed") {
        await Wallet.findOneAndUpdate(
          { userId: payout.userId },
          { $inc: { totalWithdrawn: payout.amount } }
        );
      }

      return NextResponse.json({ payout, transfer });
    } catch (transferErr) {
      payout.status = "failed";
      payout.failureReason = (transferErr as Error).message;
      await payout.save();

      // Refund on transfer failure
      await Wallet.findOneAndUpdate(
        { userId: payout.userId },
        { $inc: { balance: payout.amount } }
      );

      throw new AppError("Transfer failed", 502, "TRANSFER_FAILED");
    }
  } catch (err) {
    return toErrorResponse(err);
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const admin = await requireAdmin(req);
    await connectDB();
    const payout = await Payout.findById(params.id).lean();
    if (!payout) throw new AppError("Not found", 404);
    return NextResponse.json({ payout });
  } catch (err) {
    return toErrorResponse(err);
  }
}