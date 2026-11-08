import mongoose, { Schema, model, models } from 'mongoose';
export interface IUser {
  _id: string;
  name: string;
  email: string;
  password: string;
  phone?: string;
  role: 'user' | 'admin';
  hasPaid: boolean;
  level?: number;
  isActivated: boolean;
  walletBalance: number;
  totalSurveyEarnings: number;
  referralCode?: string;
  referredBy?: string;
  createdAt: Date;
  updatedAt: Date;
}
const UserSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String },
  role: { type: String, enum: ['user', 'admin'], default: 'user', required: true },
  hasPaid: { type: Boolean, default: false },
  level: { type: Number, default: 0 },
  isActivated: { type: Boolean, default: false },
  walletBalance: { type: Number, default: 0 },
  totalSurveyEarnings: { type: Number, default: 0 },
  referralCode: { type: String },
  referredBy: { type: String },
}, { timestamps: true });
export const User = models.User || model<IUser>('User', UserSchema);
