import { connectDB } from "@/lib/db/connect";
import { User } from "@/lib/db/models/User";
import { distributeCommission } from "@/lib/commission/distributeCommission";

/**
 * Turns a user's account on after a confirmed payment.
 * Safe to call more than once: the atomic update only flips the flag once,
 * so commissions are never paid twice.
 */
export async function activateUserAfterPayment(
  userId: string,
  amount: number
): Promise<{ activated: boolean }> {
  await connectDB();

  const result = await User.updateOne(
    { _id: userId, hasPaid: { $ne: true } },
    { $set: { hasPaid: true, isActivated: true } }
  );

  if (result.modifiedCount > 0) {
    await distributeCommission(userId, amount, "activation");
    return { activated: true };
  }

  return { activated: false };
}
