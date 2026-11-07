<<<<<<< HEAD
import mongoose, { Schema, model, models, Types } from 'mongoose';
export interface IWallet { userId: Types.ObjectId; balance: number; totalDeposits: number; totalWithdrawals: number;
  totalEarned: number;
  totalWithdrawn: number;
  _id: string;
  createdAt: Date;
  updatedAt: Date;
}
const WalletSchema = new Schema<IWallet>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  balance: { type: Number, default: 0 },
  totalDeposits: { type: Number, default: 0 },
  totalWithdrawals: { type: Number, default: 0 },
  totalEarned: { type: Number, default: 0 },
  totalWithdrawn: { type: Number, default: 0 },
}, { timestamps: true });
export const Wallet = models.Wallet || model<IWallet>('Wallet', WalletSchema);
=======
import { Schema, model, models, Document, Types } from "mongoose";

export interface IWallet extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  balance: number; // available balance
  totalEarned: number;
  totalWithdrawn: number;
  updatedAt: Date;
}

const WalletSchema = new Schema<IWallet>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },
    balance: { type: Number, default: 0, min: 0 },
    totalEarned: { type: Number, default: 0 },
    totalWithdrawn: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Wallet = models.Wallet || model<IWallet>("Wallet", WalletSchema);
>>>>>>> 33073f7 (Initial commit)
