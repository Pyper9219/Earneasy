import mongoose, { Schema, model, models } from 'mongoose';
export interface IReferralCode { code: string; userId: string; isActive: boolean;
  _id: string;
  createdAt: Date;
  updatedAt: Date;
}
const ReferralCodeSchema = new Schema<IReferralCode>({
  code: { type: String, required: true, unique: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });
export const ReferralCode = models.ReferralCode || model<IReferralCode>('ReferralCode', ReferralCodeSchema);
