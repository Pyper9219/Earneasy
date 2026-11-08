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
export const PAYOUT_METHODS = [
  "mpesa",
  "paypal",
  "flutterwave",
  "eversend",
  // legacy values kept so old records still validate
  "mobile_money",
  "bank",
] as const;

export const payoutRequestSchema = z.object({
  amount: z.number().min(1),
  destination: z
    .object({
      type: z.enum(PAYOUT_METHODS),
      accountNumber: z.string().min(1),
      bankCode: z.string().optional(),
      network: z.string().optional(),
    })
    .superRefine((destination, context) => {
      if (destination.type === "mpesa") {
        const digits = destination.accountNumber.replace(/\D/g, "");
        if (!/^(0[17]\d{8}|254[17]\d{8}|[17]\d{8})$/.test(digits)) {
          context.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Enter a valid M-Pesa number, for example 0712345678",
            path: ["accountNumber"],
          });
        }
      }
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
      if (
        ["paypal", "flutterwave", "eversend"].includes(destination.type) &&
        destination.accountNumber.trim().length < 3
      ) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Enter the account or email for this method",
          path: ["accountNumber"],
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
