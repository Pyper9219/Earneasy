import mongoose, { Schema, model, models } from 'mongoose';
export interface ICommissionLedger { userId: string; referredUserId: string; amount: number; level: number; type: string; status: string; }
const CommissionLedgerSchema = new Schema<ICommissionLedger>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true }, referredUserId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true }, level: { type: Number, required: true }, type: { type: String, enum: ['referral', 'survey', 'activation'], required: true },
  status: { type: String, enum: ['pending', 'completed', 'reversed'], default: 'pending' },
}, { timestamps: true });
export const CommissionLedger = models.CommissionLedger || model<ICommissionLedger>('CommissionLedger', CommissionLedgerSchema);
