import mongoose, { Schema, model, models } from 'mongoose';
export interface ICommissionConfig { level1: number; level2: number; level3: number; surveyRewardMin: number; surveyRewardMax: number; activationFee: number; }
const CommissionConfigSchema = new Schema<ICommissionConfig>({
  level1: { type: Number, default: 250 }, level2: { type: Number, default: 100 }, level3: { type: Number, default: 50 },
  surveyRewardMin: { type: Number, default: 30 }, surveyRewardMax: { type: Number, default: 150 }, activationFee: { type: Number, default: 450 },
}, { timestamps: { updatedAt: true, createdAt: false } });
export const CommissionConfig = models.CommissionConfig || model<ICommissionConfig>('CommissionConfig', CommissionConfigSchema);
