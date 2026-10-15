import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Survey } from '@/lib/models/Survey';

export async function GET() {
  try {
    await connectDB();
    const surveys = await Survey.find({ isActive: true }).sort({ rewardKES: -1 });
    return NextResponse.json({ success: true, surveys });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch surveys' }, { status: 500 });
  }
}
