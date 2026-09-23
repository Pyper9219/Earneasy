import { Schema, model, models, Document, Types } from "mongoose";

export type PaymentStatus = "pending" | "successful" | "failed";

export interface IPayment extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId; // who paid
  amount: number;
  currency: string;
  status: PaymentStatus;
  txRef: string;
  flwRef?: string;
  flwTransactionId?: number;
  commissionDistributed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const PaymentSchema = new Schema<IPayment>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: "KES" },
    status: {
      type: String,
      enum: ["pending", "successful", "failed"],
      default: "pending",
      index: true,
    },
    txRef: { type: String, required: true, unique: true, index: true },
    flwRef: { type: String },
    flwTransactionId: { type: Number },
    commissionDistributed: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Payment = models.Payment || model<IPayment>("Payment", PaymentSchema);