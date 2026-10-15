import mongoose, { Schema, model, models, Types } from 'mongoose';

export interface IPayment {
  userId: Types.ObjectId;
  amount: number;
  currency: string;
  status: 'pending' | 'successful' | 'completed' | 'failed';
  txRef: string;
  flwTransactionId?: number;
  flwRef?: string;
  paymentMethod?: string;
  transactionId?: string;
  createdAt: Date;
  _id: string;
  updatedAt: Date;
}

const PaymentSchema = new Schema<IPayment>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  currency: { type: String, default: 'KES' },
  status: { type: String, enum: ['pending', 'successful', 'completed', 'failed'], default: 'pending' },
  txRef: { type: String, required: true, unique: true },
  flwTransactionId: { type: Number },
  flwRef: { type: String },
  paymentMethod: { type: String },
  transactionId: { type: String },
}, { timestamps: true });

export const Payment = models.Payment || model<IPayment>('Payment', PaymentSchema);
