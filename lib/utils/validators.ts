import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2).max(80),
  email: z.string().email(),
  password: z.string().min(8).max(128),
  phone: z.string().min(7).max(20).optional(),
  ref: z.string().min(4).max(32).optional(),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const payoutRequestSchema = z.object({
  amount: z.number().positive(),
  destination: z.object({
    type: z.enum(["bank", "mobile_money"]),
    accountNumber: z.string().min(4),
    bankCode: z.string().optional(),
    network: z.string().optional(),
  }),
});

export const commissionConfigSchema = z.object({
  level1: z.number().min(0),
  level2: z.number().min(0),
  level3: z.number().min(0),
  totalPrice: z.number().min(0),
});