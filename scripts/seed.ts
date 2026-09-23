import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { connectDB } from "../lib/db/connect";
import { User } from "../lib/db/models/User";
import { CommissionConfig } from "../lib/db/models/CommissionConfig";
import { ReferralCode } from "../lib/db/models/ReferralCode";

async function seed() {
  await connectDB();
  console.log("🌱 Seeding database...");

  // Commission config
  await CommissionConfig.findOneAndUpdate(
    { key: "default" },
    { level1: 250, level2: 100, level3: 50, totalPrice: 450 },
    { upsert: true, new: true }
  );
  console.log("✓ Commission config upserted");

  // Admin user
  const adminEmail = "admin@earneasy.local";
  let admin = await User.findOne({ email: adminEmail });
  if (!admin) {
    const password = await bcrypt.hash("Admin1234!", 12);
    admin = await User.create({
      name: "Admin",
      email: adminEmail,
      password,
      role: "admin",
      referralCode: "ADMIN001",
      hasPaid: true,
    });
    await ReferralCode.create({ code: "ADMIN001", ownerId: admin._id });
    console.log(`✓ Admin created: ${adminEmail} / Admin1234!`);
  } else {
    console.log("✓ Admin already exists");
  }

  // Demo users
  const demoEmail = "demo@earneasy.local";
  let demo = await User.findOne({ email: demoEmail });
  if (!demo) {
    const password = await bcrypt.hash("Demo1234!", 12);
    demo = await User.create({
      name: "Demo User",
      email: demoEmail,
      password,
      role: "user",
      referralCode: "DEMO0001",
      referredBy: admin._id,
      level: 1,
      hasPaid: true,
    });
    await ReferralCode.create({ code: "DEMO0001", ownerId: demo._id });
    console.log(`✓ Demo user created: ${demoEmail} / Demo1234!`);
  } else {
    console.log("✓ Demo user already exists");
  }

  console.log("✅ Seeding complete");
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});