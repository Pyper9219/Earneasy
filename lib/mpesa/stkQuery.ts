import { assertMpesaConfigured, mpesaTimestamp } from "./config";
import { getAccessToken } from "./token";

export interface StkQueryResult {
  ResponseCode: string; // "0" means the request was accepted; the real result is in ResultCode
  ResultCode?: string; // "0" = success, "1032" = cancelled, "1037" = timeout, "1" = insufficient funds
  ResultDesc?: string;
  CheckoutRequestID?: string;
}

/** Asks Safaricom what happened to a push. Used as a fallback if the callback is late. */
export async function stkQuery(
  checkoutRequestId: string
): Promise<StkQueryResult> {
  const cfg = assertMpesaConfigured();
  const token = await getAccessToken();
  const timestamp = mpesaTimestamp();
  const password = Buffer.from(
    `${cfg.shortcode}${cfg.passkey}${timestamp}`
  ).toString("base64");

  const res = await fetch(`${cfg.baseUrl}/mpesa/stkpushquery/v1/query`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      BusinessShortCode: cfg.shortcode,
      Password: password,
      Timestamp: timestamp,
      CheckoutRequestID: checkoutRequestId,
    }),
    cache: "no-store",
  });

  const data = (await res.json().catch(() => ({}))) as StkQueryResult & {
    errorMessage?: string;
  };

  if (!res.ok) {
    throw new Error(data.errorMessage || `STK query failed (${res.status})`);
  }

  return data;
}
