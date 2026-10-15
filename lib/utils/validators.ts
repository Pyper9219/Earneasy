import { z } from 'zod';
export function isValidEmail(email: string): boolean { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email); }
export function isValidPhone(phone: string): boolean { return /^254[0-9]{9}$/.test(phone); }
export function sanitizeInput(input: string): string { return input.replace(/[<>]/g, '').trim(); }
export const registerSchema = z.object({ name: z.string().min(2), email: z.string().email(), password: z.string().min(6), referralCode: z.string().optional() });
export const loginSchema = z.object({ email: z.string().email(), password: z.string().min(6) });
export const payoutRequestSchema = z.object({ amount: z.number().min(1), phoneNumber: z.string().regex(/^254[0-9]{9}$/) });
export const commissionConfigSchema = z.object({ level1: z.number(), level2: z.number(), level3: z.number(), surveyRewardMin: z.number(), surveyRewardMax: z.number(), activationFee: z.number() });