import { connectDB } from '@/lib/db/connect';
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
