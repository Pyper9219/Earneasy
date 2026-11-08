import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/connect";
import { requireAuth } from "@/lib/auth/middleware";
import { toErrorResponse } from "@/lib/utils/errors";
import { Survey } from "@/lib/models/Survey";

export const dynamic = "force-dynamic";

/** Signed-in users only. */
export async function GET(req: NextRequest) {
  try {
    await requireAuth(req);
    await connectDB();
    const surveys = await Survey.find({ isActive: true }).sort({ rewardKES: -1 });
    return NextResponse.json({ success: true, surveys });
  } catch (err) {
    return toErrorResponse(err);
  }
}
