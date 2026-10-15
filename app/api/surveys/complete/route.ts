import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Survey } from '@/lib/models/Survey';
import { User } from '@/lib/models/User';

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { userId, surveyId, answers } = await req.json();

    if (!userId || !surveyId) {
      return NextResponse.json({ error: 'Missing userId or surveyId' }, { status: 400 });
    }

    const user = await User.findById(userId);
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    if (!user.isActivated) {
      return NextResponse.json(
        { error: 'Account not active. Complete KES 450 activation to unlock surveys.' },
        { status: 403 }
      );
    }

    const survey = await Survey.findById(surveyId);
    if (!survey || survey.slotsRemaining <= 0) {
      return NextResponse.json({ error: 'Survey no longer available' }, { status: 410 });
    }

    user.walletBalance = (user.walletBalance || 0) + survey.rewardKES;
    user.totalSurveyEarnings = (user.totalSurveyEarnings || 0) + survey.rewardKES;
    await user.save();

    survey.slotsRemaining = Math.max(0, survey.slotsRemaining - 1);
    await survey.save();

    return NextResponse.json({
      success: true,
      message: `Credited KES ${survey.rewardKES} to your M-Pesa balance!`,
      newBalance: user.walletBalance,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
