import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/connect";
import { User } from "@/lib/db/models/User";
import { Payment } from "@/lib/db/models/Payment";
import { CommissionLedger } from "@/lib/db/models/CommissionLedger";
import { Payout } from "@/lib/db/models/Payout";
import { requireAdmin } from "@/lib/auth/middleware";
import { toErrorResponse } from "@/lib/utils/errors";

export async function GET(req: NextRequest) {
  try {
    await requireAdmin(req);
    await connectDB();

    const [users, paidUsers, payments, commissions, payouts] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ hasPaid: true }),
      Payment.aggregate([
        { $match: { status: "successful" } },
        { $group: { _id: null, total: { $sum: "$amount" }, count: { $sum: 1 } } },
      ]),
      CommissionLedger.aggregate([
        { $group: { _id: null, total: { $sum: "$amount" }, count: { $sum: 1 } } },
      ]),
      Payout.aggregate([
        { $group: { _id: "$status", total: { $sum: "$amount" }, count: { $sum: 1 } } },
      ]),
    ]);

    return NextResponse.json({
      users,
      paidUsers,
      revenue: payments[0]?.total ?? 0,
      successfulPayments: payments[0]?.count ?? 0,
      commissionsPaid: commissions[0]?.total ?? 0,
      commissionCount: commissions[0]?.count ?? 0,
      payouts,
    });
  } catch (err) {
    return toErrorResponse(err);
  }
}