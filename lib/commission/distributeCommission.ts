<<<<<<< HEAD
﻿import { connectDB } from '@/lib/db/connect';
import { User } from '@/lib/db/models/User';
import { CommissionLedger } from '@/lib/db/models/CommissionLedger';
import { Wallet } from '@/lib/db/models/Wallet';

export async function distributeCommission(
  referredUserId: string,
  amount: number,
  type: "referral" | "survey" | "activation"
) {
  await connectDB();
  const referredUser = await User.findById(referredUserId);
  const distributed: Array<{ userId: string; amount: number; level: number }> =
    [];
  if (!referredUser || !referredUser.referredBy) return { distributed };

  const uplineUserId = referredUser.referredBy;
  const uplineUser = await User.findById(uplineUserId);
  if (!uplineUser) return { distributed };

  const commissionAmount = amount * 0.1; // 10% base commission (adjust logic as needed)
  uplineUser.walletBalance = (uplineUser.walletBalance || 0) + commissionAmount;
  await uplineUser.save();

  await CommissionLedger.create({
    userId: uplineUserId, referredUserId, amount: commissionAmount, level: 1, type, status: 'completed'
  });

  let wallet = await Wallet.findOne({ userId: uplineUserId });
  if (wallet) {
    wallet.balance += commissionAmount;
    wallet.totalEarned += commissionAmount;
    await wallet.save();
  }

  distributed.push({
    userId: String(uplineUserId),
    amount: commissionAmount,
    level: 1,
  });
  return { distributed };
}
=======
import { connectDB } from "@/lib/db/connect";
import { Payment } from "@/lib/db/models/Payment";
import { CommissionLedger } from "@/lib/db/models/CommissionLedger";
import { CommissionConfig } from "@/lib/db/models/CommissionConfig";
import { resolveUpline } from "@/lib/referral/resolveUpline";
import { creditWallet } from "./creditWallet";
import { User } from "@/lib/db/models/User";
import { Types } from "mongoose";

interface LeanCommissionConfig {
  _id: string;
  key: string;
  level1: number;
  level2: number;
  level3: number;
  totalPrice: number;
  updatedAt: Date;
}

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
    (await CommissionConfig.findOne({ key: "default" }).lean() as Promise<LeanCommissionConfig | null>) ??
    ({ level1: 250, level2: 100, level3: 50, totalPrice: 450 } as const);

  const uplines = await resolveUpline(payment.userId);

  const distributed: DistributionResult["distributed"] = [];

  for (const { userId, level } of uplines) {
    const amount =
      level === 1 ? config.level1 : level === 2 ? config.level2 : config.level3;

    if (!amount || amount <= 0) continue;

    // Confirm earner still exists
    const earner = await User.findById(userId).select("_id").lean() as Promise<{ _id: string } | null>;
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
>>>>>>> 33073f7 (Initial commit)
