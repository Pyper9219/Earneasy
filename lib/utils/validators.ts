import { z } from 'zod';
export function isValidEmail(email: string): boolean { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email); }
export function isValidPhone(phone: string): boolean { return /^254[0-9]{9}$/.test(phone); }
export function sanitizeInput(input: string): string { return input.replace(/[<>]/g, '').trim(); }
export const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  phone: z.string().optional(),
  ref: z.string().optional(),
  referralCode: z.string().optional(),
});
export const loginSchema = z.object({ email: z.string().email(), password: z.string().min(6) });
export const payoutRequestSchema = z.object({
  amount: z.number().min(1),
  destination: z
    .object({
      type: z.enum(["bank", "mobile_money"]),
      accountNumber: z.string().min(1),
      bankCode: z.string().optional(),
      network: z.string().optional(),
    })
    .superRefine((destination, context) => {
      if (destination.type === "bank" && !destination.bankCode) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Bank code is required",
          path: ["bankCode"],
        });
      }
      if (destination.type === "mobile_money" && !destination.network) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Mobile network is required",
          path: ["network"],
        });
      }
    }),
});
export const commissionConfigSchema = z
  .object({
    level1: z.number(),
    level2: z.number(),
    level3: z.number(),
    totalPrice: z.number(),
  })
  .transform(({ totalPrice, ...config }) => ({
    ...config,
    activationFee: totalPrice,
  }));