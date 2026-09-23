import { Schema, model, models, Document } from "mongoose";

export interface ICommissionConfig extends Document {
  key: string;
  level1: number;
  level2: number;
  level3: number;
  totalPrice: number;
  updatedAt: Date;
}

const CommissionConfigSchema = new Schema<ICommissionConfig>(
  {
    key: { type: String, default: "default", unique: true },
    level1: { type: Number, required: true, default: 250 },
    level2: { type: Number, required: true, default: 100 },
    level3: { type: Number, required: true, default: 50 },
    totalPrice: { type: Number, required: true, default: 450 },
  },
  { timestamps: true }
);

export const CommissionConfig =
  models.CommissionConfig ||
  model<ICommissionConfig>("CommissionConfig", CommissionConfigSchema);