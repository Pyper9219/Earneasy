import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/connect";
import { User } from "@/lib/db/models/User";
import { requireAuth } from "@/lib/auth/middleware";
import { toErrorResponse, AppError } from "@/lib/utils/errors";

export async function GET(req: NextRequest) {
  try {
    const session = await requireAuth(req);
    await connectDB();

    const user = await User.findById(session.userId)
      .select("name email phone role referralCode hasPaid createdAt")
      .lean();

    if (!user) throw new AppError("User not found", 404, "NOT_FOUND");

    return NextResponse.json({ user });
  } catch (err) {
    return toErrorResponse(err);
  }
}