import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/connect";
import { Payout } from "@/lib/db/models/Payout";
import { Wallet } from "@/lib/db/models/Wallet";
import { requireAdmin } from "@/lib/auth/middleware";
import { toErrorResponse, AppError } from "@/lib/utils/errors";
import { initiateB2CPayout } from "@/lib/palpluss/payouts";
import { z } from "zod";

export const dynamic = "force-dynamic";

const actionSchema = z.object({
  action: z.enum(["approve", "reject", "mark_paid"]),
  reason: z.string().max(300).optional(),
});

/**
 * Admin-only payout decisions.
 *
 * pending  --approve--> approved --mark_paid--> completed
 *    |                    |
 *    +--------reject------+--> rejected (funds returned to the wallet)
 *
 * A user's balance is debited when they request the withdrawal, so nothing is
 * paid out until an admin approves it here.
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const admin = await requireAdmin(req);
    await connectDB();

    const parsed = actionSchema.safeParse(await req.json().catch(() => null));
    if (!parsed.success) throw new AppError("Invalid action", 422);
    const { action, reason } = parsed.data;

    const payout = await Payout.findById(params.id);
    if (!payout) throw new AppError("Payout not found", 404, "NOT_FOUND");

    const adminId = admin.userId;

    if (action === "approve") {
      if (payout.status !== "pending") {
        throw new AppError("Only pending payouts can be approved", 409, "NOT_PENDING");
      }

      payout.status = "approved";
      payout.approvedBy = adminId as unknown as typeof payout.approvedBy;
      payout.processedBy = adminId as unknown as typeof payout.processedBy;
      payout.approvedAt = new Date();
      await payout.save();

      // Optional automatic disbursement. Off by default so a human always
      // releases funds unless the operator opts in.
      if (
        process.env.PALPLUSS_B2C === "true" &&
        payout.destination.type === "mobile_money"
      ) {
        try {
          const tx = await initiateB2CPayout({
            phone: payout.destination.accountNumber,
            amount: payout.amount,
            reference: payout.reference,
            description: "EarnEasy withdrawal",
          });

          payout.transactionId = tx.transactionId;
          if (tx.status === "SUCCESS") {
            payout.status = "completed";
            payout.paidAt = new Date();
            await payout.save();
            await Wallet.findOneAndUpdate(
              { userId: payout.userId },
              { $inc: { totalWithdrawn: payout.amount } }
            );
          } else {
            payout.status = "processing";
            await payout.save();
          }
        } catch (err) {
          // Keep it approved so the admin can retry or pay manually.
          payout.failureReason = (err as Error).message;
          payout.status = "approved";
          await payout.save();
        }
      }

      return NextResponse.json({ payout });
    }

    if (action === "mark_paid") {
      if (payout.status !== "approved" && payout.status !== "processing") {
        throw new AppError(
          "Only approved payouts can be marked as paid",
          409,
          "NOT_APPROVED"
        );
      }

      payout.status = "completed";
      payout.paidAt = new Date();
      await payout.save();

      await Wallet.findOneAndUpdate(
        { userId: payout.userId },
        { $inc: { totalWithdrawn: payout.amount } }
      );

      return NextResponse.json({ payout });
    }

    // reject: give the held funds back
    if (!["pending", "approved", "processing"].includes(payout.status)) {
      throw new AppError("This payout can no longer be rejected", 409, "LOCKED");
    }

    await Wallet.findOneAndUpdate(
      { userId: payout.userId },
      { $inc: { balance: payout.amount } }
    );

    payout.status = "rejected";
    payout.failureReason = reason || "Rejected by admin";
    payout.processedBy = adminId as unknown as typeof payout.processedBy;
    await payout.save();

    return NextResponse.json({ payout });
  } catch (err) {
    return toErrorResponse(err);
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin(req);
    await connectDB();
    const payout = await Payout.findById(params.id).lean();
    if (!payout) throw new AppError("Not found", 404, "NOT_FOUND");
    return NextResponse.json({ payout });
  } catch (err) {
    return toErrorResponse(err);
  }
}
