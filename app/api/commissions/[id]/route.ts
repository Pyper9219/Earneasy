import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/connect";
import {
  CommissionLedger,
  ICommissionLedger,
} from "@/lib/db/models/CommissionLedger";
import { requireAuth } from "@/lib/auth/middleware";
import { toErrorResponse, AppError } from "@/lib/utils/errors";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await requireAuth(req);
    await connectDB();

    const entry = await CommissionLedger.findById(params.id).lean<ICommissionLedger | null>();
    if (!entry) throw new AppError("Not found", 404, "NOT_FOUND");

    if (
      String(entry.userId) !== session.userId &&
      session.role !== "admin"
    ) {
      throw new AppError("Forbidden", 403, "FORBIDDEN");
    }

    return NextResponse.json({ entry });
  } catch (err) {
    return toErrorResponse(err);
  }
}