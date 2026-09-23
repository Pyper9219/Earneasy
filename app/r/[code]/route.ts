import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/connect";
import { ReferralCode } from "@/lib/db/models/ReferralCode";
import { setReferralCookie } from "@/lib/referral/attribution";

export async function GET(
  req: NextRequest,
  { params }: { params: { code: string } }
) {
  const code = params.code?.toUpperCase();

  await connectDB();
  const ref = await ReferralCode.findOne({ code, active: true });

  const redirectUrl = new URL(`/register?ref=${code}`, req.url);

  if (!ref) {
    return NextResponse.redirect(new URL("/register", req.url));
  }

  await ReferralCode.updateOne({ _id: ref._id }, { $inc: { clicks: 1 } });

  const res = NextResponse.redirect(redirectUrl);
  setReferralCookie(res, code);
  return res;
}