import { Schema, model, models, Document, Types } from "mongoose";

export type PayoutStatus = "pending" | "processing" | "completed" | "failed";

export interface IPayout extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  amount: number;
  status: PayoutStatus;
  destination: {
    type: "bank" | "mobile_money";
    accountNumber: string;
    bankCode?: string;
    network?: string;
  };
  reference: string;
  failureReason?: string;
  processedBy?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const PayoutSchema = new Schema<IPayout>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    amount: { type: Number, required: true, min: 1 },
    status: {
      type: String,
      enum: ["pending", "processing", "completed", "failed"],
      default: "pending",
      index: true,
    },
    destination: {
      type: {
        type: String,
        enum: ["bank", "mobile_money"],
        required: true,
      },
      accountNumber: { type: String, required: true },
      bankCode: String,
      network: String,
    },
    reference: { type: String, required: true, unique: true },
    failureReason: String,
    processedBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export const Payout = models.Payout || model<IPayout>("Payout", PayoutSchema);