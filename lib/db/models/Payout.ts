import mongoose, { Schema, model, models, Types } from 'mongoose';
export interface IPayout {
  userId: Types.ObjectId;
  amount: number;
  phoneNumber?: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  destination: {
    type: 'bank' | 'mobile_money';
    accountNumber: string;
    bankCode?: string;
    network?: string;
  };
  reference: string;
  processedBy?: Types.ObjectId;
  failureReason?: string;
  transactionId?: string;
  errorMessage?: string;
  _id: string;
  createdAt: Date;
  updatedAt: Date;
}
const PayoutSchema = new Schema<IPayout>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  phoneNumber: { type: String },
  status: { type: String, enum: ['pending', 'processing', 'completed', 'failed'], default: 'pending' },
  destination: {
    type: { type: String, enum: ['bank', 'mobile_money'], required: true },
    accountNumber: { type: String, required: true },
    bankCode: { type: String },
    network: { type: String },
  },
  reference: { type: String, required: true, unique: true },
  processedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  failureReason: { type: String },
  transactionId: { type: String },
  errorMessage: { type: String },
}, { timestamps: true });
export const Payout = models.Payout || model<IPayout>('Payout', PayoutSchema);
