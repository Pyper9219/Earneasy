import mongoose, { Schema, model, models } from 'mongoose';
export interface IPayout { userId: string; amount: number; phoneNumber: string; status: string; transactionId?: string; errorMessage?: string;
  _id?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
const PayoutSchema = new Schema<IPayout>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true }, amount: { type: Number, required: true }, phoneNumber: { type: String, required: true },
  status: { type: String, enum: ['pending', 'processing', 'completed', 'failed'], default: 'pending' }, transactionId: { type: String }, errorMessage: { type: String },
}, { timestamps: true });
export const Payout = models.Payout || model<IPayout>('Payout', PayoutSchema);
