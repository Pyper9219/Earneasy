import mongoose, { Schema, model, models, Types } from 'mongoose';
export interface IReferralCode {
  code: string;
  userId: Types.ObjectId;
  isActive: boolean;
  clicks: number;
  signups: number;
  _id: string;
  createdAt: Date;
  updatedAt: Date;
}
const ReferralCodeSchema = new Schema<IReferralCode>({
  code: { type: String, required: true, unique: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  isActive: { type: Boolean, default: true },
  clicks: { type: Number, default: 0 },
  signups: { type: Number, default: 0 },
}, { timestamps: true });
export const ReferralCode = models.ReferralCode || model<IReferralCode>('ReferralCode', ReferralCodeSchema);
