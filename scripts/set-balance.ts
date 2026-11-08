import "dotenv/config";
import mongoose from "mongoose";
import { connectDB } from "../lib/db/connect";
import { User } from "../lib/db/models/User";
import { Wallet } from "../lib/db/models/Wallet";

/**
 * Sets a user's withdrawable balance.
 *   npm run set-balance -- amosmurimi217@gmail.com 5
 *
 * Uses the same wallet record the dashboard reads, so the change is visible
 * immediately at /payouts.
 */
async function main() {
  const [emailArg, amountArg] = process.argv.slice(2);
  const email = (emailArg || "").trim().toLowerCase();
  const amount = Number(amountArg);

  if (!email || Number.isNaN(amount) || amount < 0) {
    console.error("Usage: npm run set-balance -- email@example.com 5");
    process.exit(1);
  }

  await connectDB();

  const user = await User.findOne({ email });
  if (!user) {
    console.error(`No account found for ${email}.`);
    process.exit(1);
  }

  const wallet = await Wallet.findOneAndUpdate(
    { userId: user._id },
    { $set: { balance: amount } },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );

  // Keep the legacy field on the user document in sync.
  user.walletBalance = amount;
  await user.save();

  console.log(
    `${user.email}: wallet balance is now KES ${wallet.balance} (wallet ${wallet._id})`
  );

  await mongoose.disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
