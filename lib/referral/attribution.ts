import { cookies } from 'next/headers';
import { connectDB } from '@/lib/db/connect';
import { User } from '@/lib/db/models/User';
import { ReferralCode } from '@/lib/db/models/ReferralCode';
export const REFERRAL_COOKIE = 'earneasy_ref';
export function setReferralCookie(code: string) {
  const cookieStore = cookies();
  cookieStore.set(REFERRAL_COOKIE, code, { maxAge: 60 * 60 * 24 * 30, path: '/' });
}
export async function attributeReferral(code: string, newUserId: string) {
  await connectDB();
  const referral = await ReferralCode.findOne({ code, isActive: true });
  if (!referral) return false;
  const uplineUser = await User.findById(referral.userId);
  if (!uplineUser) return false;
  await User.findByIdAndUpdate(newUserId, { referredBy: uplineUser._id });
  return true;
}