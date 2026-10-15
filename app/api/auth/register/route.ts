import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/connect";
import { User } from "@/lib/db/models/User";
import { ReferralCode } from "@/lib/db/models/ReferralCode";
import { registerSchema } from "@/lib/utils/validators";
import { hashPassword } from "@/lib/auth/hash";
import { createSessionToken, SESSION_COOKIE, SESSION_MAX_AGE } from "@/lib/auth/session";
import { generateUniqueCode } from "@/lib/referral/generateCode";
import { toErrorResponse, AppError } from "@/lib/utils/errors";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const parsed = registerSchema.safeParse(body);
    if (!parsed.success) {
      throw new AppError(parsed.error.errors[0]?.message ?? "Invalid input", 422);
    }
    const { name, email, password, phone, ref } = parsed.data;

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) throw new AppError("Email already registered", 409, "EMAIL_TAKEN");

    const cleanRef = ref?.trim();

    let inviter: { _id: unknown; level?: number } | null = null;
    if (cleanRef) {
      const refDoc = await ReferralCode.findOne({
        code: cleanRef.toUpperCase(),
        active: true,
      }).populate<{ ownerId: { _id: unknown; level?: number } }>("ownerId");
      if (refDoc) inviter = refDoc.ownerId as unknown as { _id: unknown; level?: number };
    }

    const hashed = await hashPassword(password);
    const referralCode = await generateUniqueCode();

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashed,
      phone,
      referralCode,
      referredBy: inviter?._id ?? null,
      level: inviter?.level != null ? inviter.level + 1 : 0,
    });

    await ReferralCode.create({
      code: referralCode,
      ownerId: user._id,
    });

    if (inviter?._id) {
      await ReferralCode.updateOne(
        { ownerId: inviter._id },
        { $inc: { signups: 1 } }
      );
    }

    const token = await createSessionToken({
      userId: String(user._id),
      email: user.email,
      role: user.role,
      name: user.name,
    });

    const res = NextResponse.json({
      user: {
        id: String(user._id),
        name: user.name,
        email: user.email,
        referralCode: user.referralCode,
      },
    });

    res.cookies.set(SESSION_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: SESSION_MAX_AGE,
      path: "/",
    });

    // Clear referral cookie now that it's attributed
    res.cookies.set("earneasy_ref", "", { maxAge: 0, path: "/" });

    return res;
  } catch (err) {
    return toErrorResponse(err);
  }
}