import mongoose, { Schema, model, models } from 'mongoose';

export interface ISurvey {
  title: string;
  category: string;
  partnerName: string;
  rewardKES: number;
  estMinutes: number;
  questionsCount: number;
  slotsTotal: number;
  slotsRemaining: number;
  isHighDemand?: boolean;
  isActive: boolean;
  createdAt: Date;
}

const SurveySchema = new Schema<ISurvey>(
  {
    title: { type: String, required: true },
    category: { type: String, required: true },
    partnerName: { type: String, required: true },
    rewardKES: { type: Number, required: true },
    estMinutes: { type: Number, required: true },
    questionsCount: { type: Number, default: 5 },
    slotsTotal: { type: Number, default: 100 },
    slotsRemaining: { type: Number, default: 100 },
    isHighDemand: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Survey = models.Survey || model<ISurvey>('Survey', SurveySchema);
