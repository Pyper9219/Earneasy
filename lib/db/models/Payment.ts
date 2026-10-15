import mongoose, { Schema, model, models } from 'mongoose';

export interface IPayment {
  userId: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed';
  paymentMethod: string;
  transactionId?: string;
  createdAt: Date;
  _id: string;
  updatedAt: Date;
}

const PaymentSchema = new Schema<IPayment>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  currency: { type: String, default: 'KES' },
  status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
  paymentMethod: { type: String, required: true },
  transactionId: { type: String },
}, { timestamps: true });

export const Payment = models.Payment || model<IPayment>('Payment', PaymentSchema);
