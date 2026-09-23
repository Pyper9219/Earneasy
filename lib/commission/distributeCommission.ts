import { connectDB } from "@/lib/db/connect";
import { Payment } from "@/lib/db/models/Payment";
import { CommissionLedger } from "@/lib/db/models/CommissionLedger";
import { CommissionConfig } from "@/lib/db/models/CommissionConfig";
import { resolveUpline } from "@/lib/referral/resolveUpline";
import { creditWallet } from "./creditWallet";
import { User } from "@/lib/db/models/User";
import { Types } from "mongoose";

export interface DistributionResult {
  paymentId: string;
  distributed: Array<{ userId: string; level: 1 | 2 | 3; amount: number }>;
  skipped: boolean;
  reason?: string;
}

/**
 * ⚡ Core commission engine.
 * Called from the Flutterwave webhook after a successful KES 450 payment.
 * Idempotent: uses `commissionDistributed` flag + unique index on ledger.
 */
export async function distributeCommission(
  paymentId: Types.ObjectId | string
): Promise<DistributionResult> {
  await connectDB();

  const payment = await Payment.findById(paymentId);
  if (!payment) throw new Error("Payment not found");

  if (payment.status !== "successful") {
    return {
      paymentId: String(payment._id),
      distributed: [],
      skipped: true,
      reason: "Payment not successful",
    };
  }

  // Idempotency check
  const alreadyDistributed = await CommissionLedger.findOne({
    sourcePaymentId: payment._id,
  }).lean();

  if (alreadyDistributed || payment.commissionDistributed) {
    return {
      paymentId: String(payment._id),
      distributed: [],
      skipped: true,
      reason: "Already distributed",
    };
  }

  const config =
    (await CommissionConfig.findOne({ key: "default" }).lean()) ??
    ({ level1: 250, level2: 100, level3: 50, totalPrice: 450 } as const);

  const uplines = await resolveUpline(payment.userId);

  const distributed: DistributionResult["distributed"] = [];

  for (const { userId, level } of uplines) {
    const amount =
      level === 1 ? config.level1 : level === 2 ? config.level2 : config.level3;

    if (!amount || amount <= 0) continue;

    // Confirm earner still exists
    const earner = await User.findById(userId).select("_id").lean();
    if (!earner) continue;

    try {
      await CommissionLedger.create({
        userId,
        level,
        amount,
        sourcePaymentId: payment._id,
        sourceUserId: payment.userId,
      });
      await creditWallet(userId, amount);
      distributed.push({ userId: String(userId), level, amount });
    } catch (err: unknown) {
      // Duplicate key → already credited; skip safely
      if (
        typeof err === "object" &&
        err !== null &&
        "code" in err &&
        (err as { code?: number }).code === 11000
      ) {
        continue;
      }
      throw err;
    }
  }

  payment.commissionDistributed = true;
  await payment.save();

  return {
    paymentId: String(payment._id),
    distributed,
    skipped: false,
  };
}