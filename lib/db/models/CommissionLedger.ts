import mongoose, { Schema, model, models, Types } from 'mongoose';
export interface ICommissionLedger { userId: Types.ObjectId; referredUserId: Types.ObjectId; amount: number; level: number; type: string; status: string;
  _id: string;
  createdAt: Date;
  updatedAt: Date;
}
const CommissionLedgerSchema = new Schema<ICommissionLedger>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true }, referredUserId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true }, level: { type: Number, required: true }, type: { type: String, enum: ['referral', 'survey', 'activation'], required: true },
  status: { type: String, enum: ['pending', 'completed', 'reversed'], default: 'pending' },
}, { timestamps: true });
export const CommissionLedger = models.CommissionLedger || model<ICommissionLedger>('CommissionLedger', CommissionLedgerSchema);
