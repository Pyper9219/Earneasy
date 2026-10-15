import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/connect";
import { CommissionConfig } from "@/lib/db/models/CommissionConfig";
import { requireAdmin } from "@/lib/auth/middleware";
import { commissionConfigSchema } from "@/lib/utils/validators";
import { toErrorResponse, AppError } from "@/lib/utils/errors";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    await requireAdmin(req);
    await connectDB();
    const config = await CommissionConfig.findOne({ key: "default" }).lean();
    return NextResponse.json({
      config: config ?? { level1: 250, level2: 100, level3: 50, totalPrice: 450 },
    });
  } catch (err) {
    return toErrorResponse(err);
  }
}

export async function PATCH(req: NextRequest) {
  try {
    await requireAdmin(req);
    await connectDB();

    const body = await req.json();
    const parsed = commissionConfigSchema.safeParse(body);
    if (!parsed.success) {
      throw new AppError(parsed.error.errors[0]?.message ?? "Invalid input", 422);
    }

    const config = await CommissionConfig.findOneAndUpdate(
      { key: "default" },
      { $set: parsed.data, $setOnInsert: { key: "default" } },
      { upsert: true, new: true }
    );

    return NextResponse.json({ config });
  } catch (err) {
    return toErrorResponse(err);
  }
}