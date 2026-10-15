import mongoose, { Schema, model, models } from 'mongoose';
export interface IWallet { userId: string; balance: number; totalDeposits: number; totalWithdrawals: number;
  totalEarned: number;
  totalWithdrawn: number;
  _id: string;
  createdAt: Date;
  updatedAt: Date;
}
const WalletSchema = new Schema<IWallet>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  balance: { type: Number, default: 0 }, totalDeposits: { type: Number, default: 0 }, totalWithdrawals: { type: Number, default: 0 },
}, { timestamps: true });
export const Wallet = models.Wallet || model<IWallet>('Wallet', WalletSchema);
