import "dotenv/config";
import mongoose from "mongoose";
import { connectDB } from "../lib/db/connect";
import { User } from "../lib/db/models/User";

/**
 * Promotes an existing account to admin.
 *   npm run make-admin -- amosmurimi217@gmail.com
 *
 * Register the account first, then run this. ADMIN_EMAILS in the environment
 * also grants admin without touching the database.
 */
async function main() {
  const email = (process.argv[2] || "").trim().toLowerCase();

  if (!email) {
    console.error("Usage: npm run make-admin -- email@example.com");
    process.exit(1);
  }

  await connectDB();

  const user = await User.findOneAndUpdate(
    { email },
    { $set: { role: "admin", hasPaid: true, isActivated: true } },
    { new: true }
  );

  if (!user) {
    console.error(
      `No account found for ${email}. Register at /register first, then run this again.`
    );
  } else {
    console.log(`${user.email} is now an admin and can approve payouts at /admin/payouts.`);
  }

  await mongoose.disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
