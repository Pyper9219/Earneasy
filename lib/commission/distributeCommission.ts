import { connectDB } from '@/lib/db/connect';
import { User } from '@/lib/db/models/User';
import { CommissionLedger } from '@/lib/db/models/CommissionLedger';
import { Wallet } from '@/lib/db/models/Wallet';

export async function distributeCommission(referredUserId: string, amount: number, type: 'referral' | 'survey' | 'activation') {
  await connectDB();
  const referredUser = await User.findById(referredUserId);
  if (!referredUser || !referredUser.referredBy) return;

  const uplineUserId = referredUser.referredBy;
  const uplineUser = await User.findById(uplineUserId);
  if (!uplineUser) return;

  const commissionAmount = amount * 0.1; // 10% base commission (adjust logic as needed)
  uplineUser.walletBalance = (uplineUser.walletBalance || 0) + commissionAmount;
  await uplineUser.save();

  await CommissionLedger.create({
    userId: uplineUserId, referredUserId, amount: commissionAmount, level: 1, type, status: 'completed'
  });

  let wallet = await Wallet.findOne({ userId: uplineUserId });
  if (wallet) { wallet.balance += commissionAmount; await wallet.save(); }
}
