import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/connect";
import { Payment } from "@/lib/db/models/Payment";
import { distributeCommission } from "@/lib/commission/distributeCommission";

export async function GET(req: NextRequest) {
  // Protect with a CRON_SECRET header (set in .env.local)
  const secret = req.headers.get("x-cron-secret");
  if (!process.env.CRON_SECRET || secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();

  const stuck = await Payment.find({
    status: "successful",
    commissionDistributed: false,
  }).limit(50);

  const results: Array<{ paymentId: string; distributed: number }> = [];

  for (const payment of stuck) {
    try {
      const result = await distributeCommission(payment._id);
      results.push({
        paymentId: String(payment._id),
        distributed: result.distributed.length,
      });
    } catch (err) {
      console.error(`Retry failed for ${payment._id}`, err);
    }
  }

  return NextResponse.json({ retried: results.length, results });
}