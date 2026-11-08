import { assertMpesaConfigured, mpesaTimestamp } from "./config";
import { getAccessToken } from "./token";

export interface StkPushInput {
  phone: string; // already normalised to 2547XXXXXXXX
  amount: number;
  accountReference: string; // max 12 chars in Daraja
}

export interface StkPushResult {
  MerchantRequestID: string;
  CheckoutRequestID: string;
  ResponseCode: string;
  ResponseDescription: string;
  CustomerMessage: string;
}

/** Sends the STK push, which shows the PIN prompt on the customer's phone. */
export async function stkPush({
  phone,
  amount,
  accountReference,
}: StkPushInput): Promise<StkPushResult> {
  const cfg = assertMpesaConfigured();
  const token = await getAccessToken();
  const timestamp = mpesaTimestamp();
  const password = Buffer.from(
    `${cfg.shortcode}${cfg.passkey}${timestamp}`
  ).toString("base64");

  const payload = {
    BusinessShortCode: cfg.shortcode,
    Password: password,
    Timestamp: timestamp,
    TransactionType: cfg.transactionType,
    Amount: Math.round(amount),
    PartyA: phone,
    PartyB: cfg.shortcode,
    PhoneNumber: phone,
    CallBackURL: cfg.callbackUrl,
    AccountReference: accountReference.slice(0, 12),
    TransactionDesc: "EarnEasy activation",
  };

  const res = await fetch(`${cfg.baseUrl}/mpesa/stkpush/v1/processrequest`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  const data = (await res.json().catch(() => ({}))) as Partial<StkPushResult> & {
    errorMessage?: string;
    errorCode?: string;
  };

  if (!res.ok || data.ResponseCode !== "0" || !data.CheckoutRequestID) {
    const reason =
      data.errorMessage ||
      data.ResponseDescription ||
      `STK push rejected (${res.status})`;
    throw new Error(reason);
  }

  return data as StkPushResult;
}
