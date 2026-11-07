<<<<<<< HEAD
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
=======
import { Schema, model, models, Document, Types } from "mongoose";

export interface ICommissionLedger extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId; // earner
  level: 1 | 2 | 3;
  amount: number;
  sourcePaymentId: Types.ObjectId;
  sourceUserId: Types.ObjectId; // buyer
  createdAt: Date;
}

const CommissionLedgerSchema = new Schema<ICommissionLedger>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    level: { type: Number, enum: [1, 2, 3], required: true },
    amount: { type: Number, required: true },
    sourcePaymentId: {
      type: Schema.Types.ObjectId,
      ref: "Payment",
      required: true,
      index: true,
    },
    sourceUserId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

// Prevent double payout for same payment+level+user
CommissionLedgerSchema.index(
  { userId: 1, sourcePaymentId: 1, level: 1 },
  { unique: true }
);

export const CommissionLedger =
  models.CommissionLedger ||
  model<ICommissionLedger>("CommissionLedger", CommissionLedgerSchema);
>>>>>>> 33073f7 (Initial commit)
