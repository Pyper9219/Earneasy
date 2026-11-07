<<<<<<< HEAD
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
=======
import { Schema, model, models, Document, Types } from "mongoose";

export interface IReferralCode extends Document {
  _id: Types.ObjectId;
  code: string;
  ownerId: Types.ObjectId;
  clicks: number;
  signups: number;
  active: boolean;
  createdAt: Date;
}

const ReferralCodeSchema = new Schema<IReferralCode>(
  {
    code: { type: String, required: true, unique: true, index: true },
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    clicks: { type: Number, default: 0 },
    signups: { type: Number, default: 0 },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const ReferralCode =
  models.ReferralCode || model<IReferralCode>("ReferralCode", ReferralCodeSchema);
>>>>>>> 33073f7 (Initial commit)
