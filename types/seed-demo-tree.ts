import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { connectDB } from "../lib/db/connect";
import { User } from "../lib/db/models/User";
import { ReferralCode } from "../lib/db/models/ReferralCode";
import { Payment } from "../lib/db/models/Payment";
import { distributeCommission } from "../lib/commission/distributeCommission";

async function ensureUser(
  name: string,
  email: string,
  referredBy: mongoose.Types.ObjectId | null,
  level: number
) {
  let user = await User.findOne({ email });
  if (user) return user;

  const password = await bcrypt.hash("Password123!", 12);
  const code = `U${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

  user = await User.create({
    name,
    email,
    password,
    referredBy,
    level,
    referralCode: code,
    hasPaid: false,
  });

  await ReferralCode.create({ code, ownerId: user._id });
  return user;
}

async function seedTree() {
  await connectDB();
  console.log("🌳 Building demo tree...");

  const root = await ensureUser("Alice Root", "alice@demo.local", null, 0);
  const l1a = await ensureUser("Bob L1", "bob@demo.local", root._id, 1);
  const l1b = await ensureUser("Carol L1", "carol@demo.local", root._id, 1);
  const l2a = await ensureUser("Dave L2", "dave@demo.local", l1a._id, 2);
  const l2b = await ensureUser("Eve L2", "eve@demo.local", l1b._id, 2);
  const l3a = await ensureUser("Frank L3", "frank@demo.local", l2a._id, 3);

  // Simulate a payment by Frank → distributes to Dave (L1), Bob (L2), Alice (L3)
  const txRef = `demo_${Date.now()}`;
  const payment = await Payment.create({
    userId: l3a._id,
    amount: 450,
    currency: "KES",
    status: "successful",
    txRef,
    flwRef: `FLW_${txRef}`,
    flwTransactionId: Date.now(),
  });

  await User.findByIdAndUpdate(l3a._id, { hasPaid: true });

  const result = await distributeCommission(payment._id);
  console.log("✓ Commission distributed:", result);

  console.log("✅ Demo tree ready");
  console.log("   Logins: alice@demo.local / Password123!");
  console.log("           bob@demo.local   / Password123!");
  console.log("           carol@demo.local / Password123!");
  await mongoose.disconnect();
}

seedTree().catch((err) => {
  console.error(err);
  process.exit(1);
});