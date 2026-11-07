<<<<<<< HEAD
﻿import { cookies } from 'next/headers';
import { connectDB } from '@/lib/db/connect';
import { User } from '@/lib/db/models/User';
import { ReferralCode } from '@/lib/db/models/ReferralCode';
export const REFERRAL_COOKIE = 'earneasy_ref';
export function setReferralCookie(code: string) {
  const cookieStore = cookies();
  cookieStore.set(REFERRAL_COOKIE, code, { maxAge: 60 * 60 * 24 * 30, path: '/' });
}
export async function attributeReferral(code: string, newUserId: string) {
  await connectDB();
  const referral = await ReferralCode.findOne({ code, isActive: true });
  if (!referral) return false;
  const uplineUser = await User.findById(referral.userId);
  if (!uplineUser) return false;
  await User.findByIdAndUpdate(newUserId, { referredBy: uplineUser._id });
  return true;
=======
import { NextRequest, NextResponse } from "next/server";

export const REFERRAL_COOKIE = "earneasy_ref";
export const REFERRAL_COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

export function setReferralCookie(res: NextResponse, code: string) {
  res.cookies.set(REFERRAL_COOKIE, code, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: REFERRAL_COOKIE_MAX_AGE,
    path: "/",
  });
}

export function getReferralCookie(req: NextRequest): string | null {
  return req.cookies.get(REFERRAL_COOKIE)?.value ?? null;
}

export function clearReferralCookie(res: NextResponse) {
  res.cookies.set(REFERRAL_COOKIE, "", { maxAge: 0, path: "/" });
}

export function extractRefFromQuery(req: NextRequest): string | null {
  const url = new URL(req.url);
  return url.searchParams.get("ref");
>>>>>>> 33073f7 (Initial commit)
}