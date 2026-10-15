import { User, IUser } from "@/lib/db/models/User";
import { Types } from "mongoose";

export interface UplineEntry {
  userId: Types.ObjectId;
  level: 1 | 2 | 3;
}

type ReferralParent = Pick<IUser, "_id" | "referredBy">;

/**
 * Walk up the referredBy chain from the buyer to find up to 3 upline users.
 * Level 1 = direct inviter, Level 2 = inviter's inviter, etc.
 */
export async function resolveUpline(
  buyerId: Types.ObjectId | string
): Promise<UplineEntry[]> {
  const uplines: UplineEntry[] = [];
  let current = await User.findById(buyerId)
    .select("referredBy")
    .lean<ReferralParent | null>();
  let level = 1;

  while (current?.referredBy && level <= 3) {
    uplines.push({
      userId: current.referredBy,
      level: level as 1 | 2 | 3,
    });
    current = await User.findById(current.referredBy)
      .select("referredBy")
      .lean<ReferralParent | null>();
    level++;
  }

  return uplines;
}