import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/connect";
import { User } from "@/lib/db/models/User";
import { loginSchema } from "@/lib/utils/validators";
import { verifyPassword } from "@/lib/auth/hash";
import { createSessionToken, SESSION_COOKIE, SESSION_MAX_AGE } from "@/lib/auth/session";
import { toErrorResponse, AppError } from "@/lib/utils/errors";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) throw new AppError("Invalid credentials", 422);

    const { email, password } = parsed.data;
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) throw new AppError("Invalid email or password", 401, "INVALID_CREDENTIALS");

    const ok = await verifyPassword(password, user.password);
    if (!ok) throw new AppError("Invalid email or password", 401, "INVALID_CREDENTIALS");

    const token = await createSessionToken({
      userId: String(user._id),
      email: user.email,
      role: user.role,
      name: user.name,
    });

    const res = NextResponse.json({
      user: { id: String(user._id), name: user.name, email: user.email, role: user.role },
    });

    res.cookies.set(SESSION_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: SESSION_MAX_AGE,
      path: "/",
    });

    return res;
  } catch (err) {
    return toErrorResponse(err);
  }
}