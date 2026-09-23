import { customAlphabet } from "nanoid";
import { ReferralCode } from "@/lib/db/models/ReferralCode";
import { User } from "@/lib/db/models/User";
import { Types } from "mongoose";

const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const nano = customAlphabet(alphabet, 8);

export async function generateUniqueCode(): Promise<string> {
  for (let i = 0; i < 10; i++) {
    const code = nano();
    const exists = await ReferralCode.findOne({ code }).lean();
    if (!exists) return code;
  }
  throw new Error("Could not generate unique referral code");
}

export async function createReferralCodeForUser(userId: Types.ObjectId | string) {
  const code = await generateUniqueCode();
  const doc = await ReferralCode.create({ code, ownerId: userId });
  await User.findByIdAndUpdate(userId, { referralCode: code });
  return doc;
}