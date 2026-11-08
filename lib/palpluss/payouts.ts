import { assertPalplussConfigured } from "./config";
import { palplussRequest } from "./client";

export interface B2CPayoutResult {
  transactionId: string;
  status: string;
  amount?: number;
  phone?: string;
  providerRequestId?: string;
}

/**
 * Sends money out to a customer's M-Pesa number.
 * Only used when PALPLUSS_B2C=true, otherwise the admin pays manually
 * and marks the payout as paid in the panel.
 */
export async function initiateB2CPayout(input: {
  phone: string;
  amount: number;
  reference: string;
  description: string;
}): Promise<B2CPayoutResult> {
  const cfg = assertPalplussConfigured();
  const appUrl = (process.env.NEXT_PUBLIC_APP_URL || "").replace(/\/+$/, "");

  return palplussRequest<B2CPayoutResult>("/b2c/payouts", {
    method: "POST",
    body: JSON.stringify({
      amount: Math.round(input.amount),
      phone: input.phone,
      reference: input.reference,
      description: input.description,
      ...(appUrl ? { callbackUrl: `${appUrl}/api/payments/palpluss/webhook` } : {}),
    }),
  });
}
