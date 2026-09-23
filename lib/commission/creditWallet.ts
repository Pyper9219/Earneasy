import { Wallet } from "@/lib/db/models/Wallet";
import { Types } from "mongoose";

export async function creditWallet(
  userId: Types.ObjectId | string,
  amount: number
) {
  if (amount <= 0) throw new Error("Credit amount must be positive");

  return Wallet.findOneAndUpdate(
    { userId },
    {
      $inc: { balance: amount, totalEarned: amount },
      $setOnInsert: { userId },
    },
    { upsert: true, new: true }
  );
}

export async function debitWallet(
  userId: Types.ObjectId | string,
  amount: number
) {
  if (amount <= 0) throw new Error("Debit amount must be positive");

  const wallet = await Wallet.findOne({ userId });
  if (!wallet || wallet.balance < amount) {
    throw new Error("Insufficient wallet balance");
  }

  wallet.balance -= amount;
  wallet.totalWithdrawn += amount;
  await wallet.save();
  return wallet;
}